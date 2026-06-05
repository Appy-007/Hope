import anchorData from "@/data/anchorEmbeddings.json";
import { searchSimilar } from "@/lib/vectorDb";

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

export function checkIsGreetingOrThanks(message: string): { isMatch: boolean; type: "greeting" | "thanks" | null } {
  const clean = message.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  
  const greetings = new Set([
    "hi", "hello", "hey", "heyy", "heyyy", "yo", "hola", "greetings", 
    "good morning", "good afternoon", "good evening", "howdy", "sup"
  ]);
  
  const thanks = new Set([
    "thanks", "thank you", "thank u", "tysm", "thank you so much", 
    "thanks a lot", "thankyou", "thx", "appreciate it"
  ]);
  
  if (greetings.has(clean)) {
    return { isMatch: true, type: "greeting" };
  }
  
  if (thanks.has(clean)) {
    return { isMatch: true, type: "thanks" };
  }
  
  if (
    clean.startsWith("hi ") || 
    clean.startsWith("hello ") || 
    clean.startsWith("hey ") || 
    clean.startsWith("good morning ") || 
    clean.startsWith("good afternoon ") || 
    clean.startsWith("good evening ")
  ) {
    return { isMatch: true, type: "greeting" };
  }
  
  if (
    clean.startsWith("thanks ") || 
    clean.startsWith("thank you ")
  ) {
    return { isMatch: true, type: "thanks" };
  }
  
  return { isMatch: false, type: null };
}

export async function checkRelevancy(
  message: string,
  threshold = 0.6
): Promise<{ 
  relevant: boolean; 
  maxSimilarity: number; 
  isFallback: boolean; 
  source: "sqlite" | "local_embeddings" | "keyword" 
}> {
  const text = message.trim();
  if (!text) {
    return { relevant: false, maxSimilarity: 0, isFallback: false, source: "keyword" };
  }

  const greetThanksCheck = checkIsGreetingOrThanks(text);
  if (greetThanksCheck.isMatch) {
    return {
      relevant: true,
      maxSimilarity: 1.0,
      isFallback: false,
      source: "keyword"
    };
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

  // Attempt SQLite search
  try {
    const results = searchSimilar(queryEmbedding, 1);
    if (results.length > 0) {
      const similarity = results[0].similarity;
      return {
        relevant: similarity >= threshold,
        maxSimilarity: similarity,
        isFallback: false,
        source: "sqlite",
      };
    } else {
      console.warn("SQLite collection is empty. Falling back to local embedding similarity.");
    }
  } catch (error) {
    console.error("SQLite query failed. Falling back to local embedding similarity. Error:", error);
  }

  // Fallback to local embedding similarity check
  const localResult = checkLocalSimilarity(queryEmbedding, threshold);
  return {
    ...localResult,
    isFallback: true,
    source: "local_embeddings",
  };
}
