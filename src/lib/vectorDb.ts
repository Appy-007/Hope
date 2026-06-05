import Database from "better-sqlite3";
import path from "path";

// Initialize SQLite database
const dbPath = path.resolve(process.cwd(), "hope.db");
const db = new Database(dbPath);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    embedding TEXT NOT NULL, -- JSON string representing number[]
    source TEXT
  )
`);

export interface DocumentRow {
  id: string;
  text: string;
  embedding: string; // JSON string representing number[]
  source: string | null;
}

export function upsertDocuments(
  ids: string[],
  embeddings: number[][],
  documents: string[],
  metadatas: { source: string }[]
) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO documents (id, text, embedding, source)
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    for (let i = 0; i < ids.length; i++) {
      insert.run(
        ids[i],
        documents[i],
        JSON.stringify(embeddings[i]),
        metadatas[i]?.source || null
      );
    }
  });

  transaction();
}

export function searchSimilar(queryEmbedding: number[], limit = 1) {
  const stmt = db.prepare("SELECT id, text, embedding, source FROM documents");
  const rows = stmt.all() as DocumentRow[];

  const results = rows.map((row) => {
    const vector = JSON.parse(row.embedding) as number[];
    const similarity = cosineSimilarity(queryEmbedding, vector);
    return {
      id: row.id,
      text: row.text,
      source: row.source,
      similarity,
    };
  });

  // Sort descending by similarity
  results.sort((a, b) => b.similarity - a.similarity);

  return results.slice(0, limit);
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
