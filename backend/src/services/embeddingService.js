async function queryHuggingFace(text) {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: text })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result[0]; // Returns array of embeddings
}

export async function createEmbedding(text) {
  try {
    const embedding = await queryHuggingFace(text);
    return embedding;
  } catch (error) {
    console.error('Embedding error:', error);
    throw error;
  }
}

export async function createBatchEmbeddings(texts) {
  const embeddings = [];
  for (const text of texts) {
    const embedding = await createEmbedding(text);
    embeddings.push(embedding);
  }
  return embeddings;
}
