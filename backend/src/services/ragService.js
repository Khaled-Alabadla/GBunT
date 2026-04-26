import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

// Load coffee knowledge files once at startup
const coffeeKnowledgeAR = readFileSync(join(__dirname, '../data/coffee_knowledge_ar.md'), 'utf-8');
const coffeeKnowledgeEN = readFileSync(join(__dirname, '../data/coffee_knowledge_en.md'), 'utf-8');

export async function handleChat(req, res) {
  const { message, conversationHistory = [] } = req.body;
  const lang = req.detectedLanguage || 'en';

  // إعداد الـ Headers للـ SSE (عشان الفرونت إند يتوقع ستريم)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const isArabic = /[\u0600-\u06FF]/.test(message);
    const knowledgeContext = isArabic ? coffeeKnowledgeAR : coffeeKnowledgeEN;

    const systemPrompt = `
أنت باريستا مصري صايع مهنة، اسمك "خبير القهوة".
لغتك هي العامية المصرية بتاعة "ولاد البلد" الشاطرين، مش لغة كتب ولا لغة كرتون.

الأسلوب:
- اكتب زي ما الناس بتكتب لبعضها في الشات.
- ممنوع منعاً باتاً استخدام الهاشتاج (#) أو النجوم (*) أو أي تنسيق غير الكلام السادة.
- لو حد سأل عن حاجة غير القهوة، ارفض بشياكة مصرية (مثلاً: لو حد طلب شاي احكيله: يا باشا احنا ملوك القهوة بس، لو عاوز شاي روح عند بتاع الشاي اللي جنبنا،  لو حد طلب نسكافيه احكيله: يا باشا احنا ملوك القهوة بس، لو عاوز نسكافيه روح عند بتاع النسكافيه اللي جنبنا).
- لو حد سأل بالإنجليزي، رد English محترف ومختصر جداً عن القهوة بس.
- ممنوع تستخدم نجوم * أبداً
- ممنوع تضيف نقاط . في نهاية الجمل أبداً

قائمة المحظورات (عشان اللغة متطلعش ركيكة):
- ممنوع تقول "أهلاً بك" أو "منور يا بطل" أو "يا باشا" في كل جملة.
- ممنوع التكرار الممل.
- ممنوع استخدام لغة عربية فصحى في نص الكلام.

مهم جداً: استخدم المعلومات اللي تحت ده عشان تجاوب، ده المصدر الأساسي لتعليمك:
${knowledgeContext}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V4-Pro",
        messages,
        max_tokens: 1024,
        stream: false,
        temperature: 0.2,
        top_p: 0.8,
        repetition_penalty: 1.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`TogetherAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const fullContent = data.choices[0]?.message?.content || "";

    if (fullContent) {
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: fullContent })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: 'done', sources: 1 })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat Service Error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
}