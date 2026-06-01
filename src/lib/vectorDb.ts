import { ChromaClient } from "chromadb";

const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

let chromaClient: ChromaClient | null = null;

export function getChromaClient() {
  if (!chromaClient) {
    chromaClient = new ChromaClient({
      path: CHROMA_URL,
    });
  }
  return chromaClient;
}

export async function getCollection() {
  const client = getChromaClient();
  return await client.getOrCreateCollection({
    name: "hope_stray_animal_care",
    metadata: { "hnsw:space": "cosine" }, // Sets the metric to cosine distance (1 - similarity)
  });
}
