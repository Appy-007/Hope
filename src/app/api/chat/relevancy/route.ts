import { NextResponse } from "next/server";
import { checkRelevancy } from "@/lib/relevancy";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { relevant, maxSimilarity, isFallback, source } = await checkRelevancy(message);

    return NextResponse.json({
      relevant,
      maxSimilarity,
      isFallback,
      source,
    });
  } catch (error) {
    console.error("Error in relevancy check endpoint:", error);
    return NextResponse.json(
      { error: "Something went wrong during relevancy check" },
      { status: 500 }
    );
  }
}
