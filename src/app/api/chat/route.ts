import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { KOLKATA_NGOS } from "@/data/kolkataNgos";
import Fuse from "fuse.js";

// Initialize Fuse for local NGO RAG retrieval
const ngoFuse = new Fuse(KOLKATA_NGOS, {
  keys: ["name", "description", "address", "areaHint", "tags"],
  threshold: 0.4,
});

function getRelevantNgos(message: string) {
  const results = ngoFuse.search(message);
  return results.map((r) => r.item);
}

function isStrayAnimalRelated(message: string) {
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

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userMessage = String(message).trim();
    if (userMessage.length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Filter out irrelevant messages to save LLM tokens
    if (!isStrayAnimalRelated(userMessage)) {
      return NextResponse.json({
        generated_text:
          "Sorry, this model is not trained for such questions. I can only assist with topics related to stray animal care (first-aid, feeding, safety) and rescue contacts in Kolkata.",
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing server configuration. Please set the GROQ_API_KEY environment variable.",
        },
        { status: 503 }
      );
    }

    // Retrieve relevant NGOs based on the query (RAG)
    const relevantNgos = getRelevantNgos(userMessage);
    let ngoContext = "";
    if (relevantNgos.length > 0) {
      ngoContext =
        "\nHere are the most relevant Kolkata NGOs for this situation:\n" +
        relevantNgos
          .map((ngo) => {
            let details = `- **${ngo.name}**\n  Address: ${ngo.address}\n  Tags: ${ngo.tags.join(", ")}`;
            if (ngo.phone) details += `\n  Phone: ${ngo.phone}`;
            if (ngo.email) details += `\n  Email: ${ngo.email}`;
            if (ngo.website) details += `\n  Website: ${ngo.website}`;
            if (ngo.areaHint) details += `\n  Area Coverage: ${ngo.areaHint}`;
            return details;
          })
          .join("\n\n");
    } else {
      ngoContext =
        "\nHere is the general list of Kolkata NGOs:\n" +
        KOLKATA_NGOS.map((ngo) => {
          const details = `- **${ngo.name}** (${ngo.areaHint || "Kolkata"})\n  Phone: ${ngo.phone || "N/A"}\n  Support: ${ngo.tags.join(", ")}`;
          return details;
        }).join("\n");
    }

    const model = new ChatGroq({
      apiKey,
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      maxTokens: 350,
    });

    const systemPrompt =
      "You are Hope, a Kolkata-focused assistant for STRAY ANIMAL help.\n" +
      "Only answer questions relevant to stray dogs/cats (basic first aid, feeding, hydration, safety, rabies risk, when to contact an NGO/vet, transport tips).\n" +
      "If the user asks for anything unrelated, refuse briefly and ask them to rephrase about a stray animal.\n" +
      "Be practical and concise. Always include a short safety note when appropriate (avoid bites/scratches, wash hands).\n" +
      "Do NOT provide illegal/unsafe instructions. Do NOT claim to be a veterinarian.\n\n" +
      "Use the following retrieved local Kolkata NGO information to guide the user on who to contact if they need rescue, ambulance, or clinical support:\n" +
      ngoContext;

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `User message:\n${userMessage}\n\nRespond with actionable steps. If this sounds urgent (heavy bleeding, unconscious, seizure, difficulty breathing), tell them to call a nearby NGO/vet immediately.`
      ),
    ]);

    const generatedText = typeof response.content === "string" 
      ? response.content.trim() 
      : Array.isArray(response.content) 
        ? JSON.stringify(response.content).trim() 
        : "";

    return NextResponse.json({ generated_text: generatedText || null });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
