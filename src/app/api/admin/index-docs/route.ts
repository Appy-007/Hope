import { NextResponse } from "next/server";
import { getCollection } from "@/lib/vectorDb";

// Default documents loaded from Kolkata ARC NGO details and stray animal care guides
const DEFAULT_DOCUMENTS = [
  "Animal Rescue and Care (PFA Kolkata - ARC) is a Kolkata-based NGO registered under the Trust Act in 2016 that has been working for the welfare of stray animals and their rights. Somak Chatterjee and Titas Mukherjee have been running this shelter-cum-hospital since 2014. The main objective of the organization is to create a better world for our voiceless friends by spreading awareness, defending animal rights, and fostering coexistence.",
  "ARC provides medical care, treatment, adequate care, and a safe refuge for ill, injured, or abused street dogs and cats. They also run a rehabilitation center and provide a permanent home for senior, abandoned, and differently-abled street dogs, as well as puppies requiring long-term treatment and care.",
  "ARC conducts regular, organized monthly spay and neuter programs (Animal Birth Control) in Kolkata to control the street dog and cat populations. This prevents animal suffering, reduces the incidence of rabies, and minimizes human-animal conflicts in the city.",
  "ARC drives anti-rabies vaccination, deworming, and medical treatment campaigns. They rescue distressed animals in need, treat injuries and sickness, and support local animal lovers by supplying medicines and vaccines to care for street animals in their neighborhoods.",
  "ARC works to rescue tortured or abandoned animals and facilitate their adoption into loving families. They educate communities to replace neglect and cruelty with compassion, striving for a world with equal rights and coexistence.",
  "In case of a street dog or cat with a bleeding wound, paw injury, or fracture, clean the area with mild saline water. Keep the animal in a safe, quiet spot and contact a nearby NGO or vet clinic immediately. Do not apply harsh chemicals without veterinary guidance.",
  "Provide clean water daily. Stray dogs can be fed boiled rice, curd, boiled chicken, or dog food. Avoid chocolate, onions, garlic, raisins, and cooked bones. Stray cats can be fed cat food, boiled fish, or milk diluted with water if they tolerate it.",
  "Approach a scared or aggressive injured stray animal slowly and calmly. Use a soft towel or muzzle if safe to prevent bites. Keep children away. Call an NGO ambulance or animal rescue if the animal is too aggressive or difficult to handle safely."
];

async function embedText(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set.");
  }
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

  return data.embedding.values as number[];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const docs = Array.isArray(body.documents) && body.documents.length > 0
      ? body.documents
      : DEFAULT_DOCUMENTS;

    console.log(`Indexing ${docs.length} documents into Chroma DB...`);

    const embeddings: number[][] = [];
    for (let i = 0; i < docs.length; i++) {
      console.log(`Embedding document ${i + 1}/${docs.length}...`);
      const vector = await embedText(docs[i]);
      embeddings.push(vector);
    }

    const ids = docs.map((_: string, idx: number) => `doc_${Date.now()}_${idx}`);
    const metadatas = docs.map(() => ({ source: "kolkata_ngo_web" }));

    const collection = await getCollection();
    
    // Upsert into Chroma DB
    await collection.upsert({
      ids,
      embeddings,
      metadatas,
      documents: docs,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully indexed ${docs.length} documents into Chroma DB.`,
      ids,
    });
  } catch (error: unknown) {
    console.error("Indexing failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to index documents";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
