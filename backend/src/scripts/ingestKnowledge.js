import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { addToVectorStore } from '../services/vectorStore.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

function splitIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    chunks.push(chunk);
  }
  
  return chunks;
}

async function ingestKnowledge() {
  console.log('Starting knowledge ingestion...');
  
  try {
    // Arabic knowledge
    const arPath = join(__dirname, '../data/coffee_knowledge_ar.md');
    const arContent = readFileSync(arPath, 'utf-8');
    const arChunks = splitIntoChunks(arContent);
    
    console.log(`Processing ${arChunks.length} Arabic chunks...`);
    await addToVectorStore(arChunks, { language: 'ar', source: 'coffee_knowledge_ar.md' });
    console.log('Arabic knowledge ingested successfully!');
    
    // English knowledge
    const enPath = join(__dirname, '../data/coffee_knowledge_en.md');
    const enContent = readFileSync(enPath, 'utf-8');
    const enChunks = splitIntoChunks(enContent);
    
    console.log(`Processing ${enChunks.length} English chunks...`);
    await addToVectorStore(enChunks, { language: 'en', source: 'coffee_knowledge_en.md' });
    console.log('English knowledge ingested successfully!');
    
    console.log('Knowledge ingestion complete!');
  } catch (error) {
    console.error('Ingestion error:', error);
    console.error('Make sure you have HUGGINGFACE_API_KEY in your .env file');
  }
}

ingestKnowledge().catch(console.error);
