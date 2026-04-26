import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const hf = new HfInference(process.env.HF_TOKEN || 'YOUR_HF_TOKEN');

export async function topicGuard(req, res, next) {
  const message = req.body.message || '';
  const lang = req.detectedLanguage || 'en';

  try {
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: 'You are a classifier. Is the following question related to coffee, coffee beans, caffeine, brewing equipment, or coffee-derived beverages? Answer ONLY with YES or NO. Nothing else.' },
        { role: 'user', content: message }
      ],
      max_tokens: 10
    });

    const answer = (response.choices[0]?.message?.content || '').trim().toUpperCase();

    if (answer !== 'YES') {
      const offTopicMessage = lang === 'ar'
        ? 'معلش: انا بحكي عن القهوة بس، لو حابب نحكي أهلا وسهلا غير هيك ما بقدر أفيدك ☕'
        : 'Sorry: I only talk about coffee. If you want to discuss something else, I can\'t help you ☕';
      
      return res.json({ type: 'off_topic', message: offTopicMessage });
    }

    next();
  } catch (error) {
    console.error('Topic guard error:', error);
    next();
  }
}
