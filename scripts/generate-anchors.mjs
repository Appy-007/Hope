import fs from 'fs';
import path from 'path';

// Manually load .env
const envPath = './.env';
let apiKey = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && key.trim() === 'GOOGLE_GENERATIVE_AI_API_KEY') {
        apiKey = values.join('=').trim();
      }
    }
  }
}

if (!apiKey) {
  console.error("Error: GOOGLE_GENERATIVE_AI_API_KEY not found in .env file.");
  process.exit(1);
}

const anchors = [
  "stray dog injured bleeding limb paw wound",
  "street cat sick vomiting diarrhea not eating weak",
  "animal first aid rescue emergency care",
  "Kolkata NGO animal rescue contacts telephone ambulance",
  "rabies vaccine dog bite safety risk",
  "spay neuter animal sterilization street dog program",
  "how to feed street puppies water milk food",
  "tick fever fleas mange treatment for dogs",
  "approach aggressive scared street animal safe capture",
  "how to report hit and run dog accident",
  "distemper parvo canine feline disease symptoms",
  "street kitten motherless bottle feed care",
  "dehydration heat stroke animal care summer",
  "vet clinic near me medical emergency street animal",
  "animal shelter rescue home list of contacts",
];

async function generateEmbeddings() {
  console.log(`Generating embeddings for ${anchors.length} anchor phrases...`);
  const results = [];

  for (const text of anchors) {
    try {
      console.log(`Embedding: "${text}"`);
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

      const data = await response.json();
      if (data.embedding && data.embedding.values) {
        results.push({
          text,
          embedding: data.embedding.values,
        });
      } else {
        console.error(`Failed to embed "${text}":`, data);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error embedding "${text}":`, error);
      process.exit(1);
    }
  }

  const outDir = './src/data';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'anchorEmbeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`Successfully generated and saved anchor embeddings to ${outPath}`);
}

generateEmbeddings();
