"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Local FAQ Data
const faqData = [
  {
    question: "Why is my cat not eating?",
    answer:
      "Cats can stop eating due to illness, stress, or changes in diet. If it lasts more than 24 hours, consult a vet.",
  },
  {
    question: "How to clean a dog's wound?",
    answer:
      "Wash with mild saline water, avoid harsh antiseptics, and consult a vet for deep wounds.",
  },
  {
    question: "What to do if I find an injured stray?",
    answer:
      "Contact your nearest animal rescue NGO and keep the animal safe until help arrives.",
  },
];

const fuse = new Fuse(faqData, { keys: ["question"], threshold: 0.4 });

export default function HomePage() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    // Step 1: Local FAQ
    const result = fuse.search(input);
    if (result.length > 0) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: result[0].item.answer },
      ]);
      setInput("");
      setLoading(false);
      return;
    }

    // Step 2: Hugging Face API Fallback
    try {
        console.log("DATA HERE",input)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      console.log("DATA___",data)
      const botReply =
        data.generated_text || "Sorry, I couldn't find an answer.";

      setMessages((prev) => [...prev, { role: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error contacting AI service." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">🐾 Tell us your problem</h1>

      <Card className="w-full max-w-lg shadow-lg">
        <CardContent className="flex flex-col h-[400px]">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs text-sm shadow ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 text-sm shadow">
                    Bot is typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about animal care..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
