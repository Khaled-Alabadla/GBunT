import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VECTOR_DB_PATH = join(__dirname, '../data/vector_store.json');

let vectorStore = [];

export async function loadVectorStore() {
  if (existsSync(VECTOR_DB_PATH)) {
    const data = readFileSync(VECTOR_DB_PATH, 'utf-8');
    vectorStore = JSON.parse(data);
  }
}

export async function saveVectorStore() {
  writeFileSync(VECTOR_DB_PATH, JSON.stringify(vectorStore, null, 2));
}

export async function addToVectorStore(chunks, metadata = {}) {
  await loadVectorStore();

  for (let i = 0; i < chunks.length; i++) {
    vectorStore.push({
      text: chunks[i],
      metadata: { ...metadata, id: Date.now() + i }
    });
  }

  await saveVectorStore();
  return { added: chunks.length };
}

export async function searchVectorStore(query, lang = 'en', nResults = 5) {
  try {
    await loadVectorStore();
    
    if (vectorStore.length === 0) {
      console.log('Vector store is empty!');
      return '';
    }

    console.log(`Vector store has ${vectorStore.length} entries, searching for lang=${lang}`);

    // Filter by language if specified
    const filteredStore = lang 
      ? vectorStore.filter(item => item.metadata.language === lang)
      : vectorStore;

    if (filteredStore.length === 0) {
      console.log(`No entries found for language=${lang}, trying all languages`);
      // Fallback to all languages if specific language has no results
      const allStore = vectorStore;
      if (allStore.length === 0) return '';
      return allStore.slice(0, nResults).map(r => r.text).join('\n\n');
    }

    // Improved keyword matching - also match partial words and coffee-related terms
    const queryWords = query.toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1);
    
    // Coffee-related keyword mapping for better matching
    const coffeeKeywords = {
      'espresso': ['إسبريسو', 'اسبريسو'],
      'coffee': ['قهوة', 'قهوه', 'بن', 'بُن'],
      'arabica': ['أرابيكا', 'ارابيكا'],
      'robusta': ['روبوستا'],
      'brew': ['تحضير', 'تخمير'],
      'roast': ['تحميص', 'حمص'],
      'grind': ['طحن', 'طاحونة'],
      'cappuccino': ['كابتشينو', 'كابوتشينو'],
      'latte': ['لاتيه', 'لاتيه'],
      'cold': ['بارد', 'كولد', 'كولد برو'],
      'filter': ['فلتر', 'تصفية'],
      'french': ['فرنش', 'فرنسي'],
      'turkish': ['تركي', 'عربي'],
      'beans': ['حبوب', 'بُن'],
      'caffeine': ['كافيين', 'كافين'],
      'machine': ['ماكينة', 'آلة'],
      'milk': ['حليب', 'لبن'],
      'sugar': ['سكر'],
      'water': ['ماء', 'مياه'],
      'temperature': ['حرارة', 'درجة'],
      'pour': ['صب', 'بور'],
      'origin': ['منشأ', 'أصل'],
      'taste': ['نكهة', 'طعم', 'مذاق'],
      'aroma': ['رائحة', 'عطر'],
      'acid': ['حموضة', 'حمض'],
      'body': ['قوام', 'جسم'],
      'cup': ['كوب', 'فنجان'],
    };

    // Expand query words with related terms
    const expandedWords = [...queryWords];
    for (const word of queryWords) {
      for (const [key, values] of Object.entries(coffeeKeywords)) {
        if (key.includes(word) || word.includes(key)) {
          expandedWords.push(...values);
        }
        if (values.some(v => v.includes(word) || word.includes(v))) {
          expandedWords.push(key);
        }
      }
    }

    const uniqueWords = [...new Set(expandedWords.filter(w => w.length > 1))];

    const scored = filteredStore.map(item => {
      const textLower = item.text.toLowerCase();
      let score = 0;
      for (const word of uniqueWords) {
        if (textLower.includes(word)) {
          score += 1;
        }
      }
      return { text: item.text, score };
    });

    // Sort by score and get top results
    const topResults = scored
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 0)
      .slice(0, nResults);

    if (topResults.length === 0) {
      console.log('No keyword matches found, returning top chunks as fallback');
      // If no matches, return first chunks as context
      return filteredStore.slice(0, nResults).map(r => r.text).join('\n\n');
    }

    console.log(`Found ${topResults.length} matching chunks with scores:`, topResults.map(r => r.score));
    return topResults.map(r => r.text).join('\n\n');
  } catch (error) {
    console.error('Vector store search error:', error);
    return '';
  }
}
