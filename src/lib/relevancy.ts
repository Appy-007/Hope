import anchorData from "@/data/anchorEmbeddings.json";
import { getCollection } from "@/lib/vectorDb";

interface AnchorEmbedding {
  text: string;
  embedding: number[];
}

const anchors = anchorData as AnchorEmbedding[];

// Fallback keyword-based check
function isStrayAnimalRelatedKeyword(message: string): boolean {
  const text = message.toLowerCase();
  const keywords = [
    "stray",
    "street dog",
    "street cat",
    "dog",
    "puppy",
    "cat",
    "kitten",
    "rabies",
    "bite",
    "wound",
    "injury",
    "bleeding",
    "limp",
    "vomit",
    "diarrhea",
    "not eating",
    "weak",
    "fever",
    "mange",
    "ticks",
    "fleas",
    "deworm",
    "spay",
    "neuter",
    "steril",
    "vaccin",
    "food",
    "water",
    "rescue",
    "ngo",
    "ambulance",
    "vet",
    "animal",
  ];
  return keywords.some((k) => text.includes(k));
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fallback local embedding similarity check
function checkLocalSimilarity(queryEmbedding: number[], threshold: number): { relevant: boolean; maxSimilarity: number } {
  let maxSimilarity = -1;
  for (const anchor of anchors) {
    const similarity = cosineSimilarity(queryEmbedding, anchor.embedding);
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }
  }
  return {
    relevant: maxSimilarity >= threshold,
    maxSimilarity,
  };
}

export async function checkRelevancy(
  message: string,
  threshold = 0.6
): Promise<{ 
  relevant: boolean; 
  maxSimilarity: number; 
  isFallback: boolean; 
  source: "chromadb" | "local_embeddings" | "keyword" 
}> {
  const text = message.trim();
  if (!text) {
    return { relevant: false, maxSimilarity: 0, isFallback: false, source: "keyword" };
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_GENERATIVE_AI_API_KEY is not set. Falling back to keyword check.");
    return {
      relevant: isStrayAnimalRelatedKeyword(text),
      maxSimilarity: 1,
      isFallback: true,
      source: "keyword",
    };
  }

  let queryEmbedding: number[] | null = null;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            parts: [{ text }],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.embedding?.values) {
      throw new Error("Invalid response format from embedding API");
    }

    queryEmbedding = data.embedding.values as number[];
  } catch (error) {
    console.error("Failed to generate embedding from Gemini API. Falling back to keyword check:", error);
    return {
      relevant: isStrayAnimalRelatedKeyword(text),
      maxSimilarity: 1,
      isFallback: true,
      source: "keyword",
    };
  }

  // Attempt Chroma DB search
  try {
    const collection = await getCollection();
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 1,
    });

    if (results.distances && results.distances[0] && results.distances[0].length > 0) {
      const distance = results.distances[0][0]; // Cosine distance (0 to 2)
      if (distance !== null) {
        const similarity = 1 - distance; // Cosine similarity

        return {
          relevant: similarity >= threshold,
          maxSimilarity: similarity,
          isFallback: false,
          source: "chromadb",
        };
      }
    } else {
      console.warn("Chroma DB collection is empty. Falling back to local embedding similarity.");
    }
  } catch (error) {
    console.error("Chroma DB query failed. Falling back to local embedding similarity. Error:", error);
  }

  // Fallback to local embedding similarity check
  const localResult = checkLocalSimilarity(queryEmbedding, threshold);
  return {
    ...localResult,
    isFallback: true,
    source: "local_embeddings",
  };
}
