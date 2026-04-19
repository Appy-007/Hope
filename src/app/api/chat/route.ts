import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const token = process.env.HUGGING_FACE_API;
    if (!token) {
      return NextResponse.json(
        {
          error:
            "Missing server config. Set HUGGING_FACE_API in your environment to enable AI replies.",
        },
        { status: 503 }
      );
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            (typeof data?.error === "string" && data.error) ||
            "AI service request failed.",
          detail: data,
        },
        { status: response.status }
      );
    }

    // HF responses vary by model; normalize to a simple shape for the client.
    const generated =
      (Array.isArray(data) && data[0]?.generated_text) || data?.generated_text;

    return NextResponse.json({
      generated_text:
        typeof generated === "string" && generated.trim().length > 0
          ? generated
          : null,
      raw: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
