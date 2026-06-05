import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { KOLKATA_NGOS } from "@/data/kolkataNgos";
import Fuse from "fuse.js";
import { checkRelevancy, checkIsGreetingOrThanks } from "@/lib/relevancy";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis and Rate Limiter if keys are provided
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(7, "1 m"), // 10 requests per minute
      analytics: true,
    });
  } else {
    console.warn(
      "Upstash Redis environment variables are missing. Rate limiting and response caching are disabled."
    );
  }
} catch (error) {
  console.error("Failed to initialize Upstash Redis/Ratelimit:", error);
}

// Initialize Fuse for local NGO RAG retrieval
const ngoFuse = new Fuse(KOLKATA_NGOS, {
  keys: ["name", "description", "address", "areaHint", "tags"],
  threshold: 0.4,
});

function getRelevantNgos(message: string) {
  const results = ngoFuse.search(message);
  return results.map((r) => r.item);
}

export async function POST(req: Request) {
  try {
    // Apply Rate Limiting
    if (ratelimit) {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again in a minute." },
          { status: 429 }
        );
      }
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userMessage = String(message).trim();
    if (userMessage.length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Intercept simple greetings or gratitude responses
    const greetThanksCheck = checkIsGreetingOrThanks(userMessage);
    if (greetThanksCheck.isMatch) {
      if (greetThanksCheck.type === "greeting") {
        return NextResponse.json({
          generated_text: "Hello! I am Hope, your stray animal care assistant for Kolkata. How can I help you with a stray dog or cat today?"
        });
      } else {
        return NextResponse.json({
          generated_text: "You're welcome! I'm glad I could help. Let me know if you need anything else for stray animals in Kolkata."
        });
      }
    }

    // Check Redis Cache
    let cacheKey = "";
    if (redis) {
      try {
        const msgBuffer = new TextEncoder().encode(userMessage.toLowerCase());
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        cacheKey = `cache:chat:${hash}`;

        const cachedResponse = await redis.get<string>(cacheKey);
        if (cachedResponse) {
          return NextResponse.json({ generated_text: cachedResponse, cached: true });
        }
      } catch (err) {
        console.error("Redis cache lookup error:", err);
      }
    }

    // Filter out irrelevant messages to save LLM tokens
    const { relevant } = await checkRelevancy(userMessage);
    if (!relevant) {
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

    // Save response to Redis Cache (expires in 24 hours / 86400 seconds)
    if (redis && cacheKey && generatedText) {
      try {
        await redis.set(cacheKey, generatedText, { ex: 86400 });
      } catch (err) {
        console.error("Redis cache set error:", err);
      }
    }

    return NextResponse.json({ generated_text: generatedText || null });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
