"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
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
    { id: string; role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(
    () => [
      "A stray dog has a bleeding paw — what should I do immediately?",
      "What can I feed a weak stray cat?",
      "How do I safely approach an injured animal?",
      "When should I call an NGO vs a vet?",
    ],
    []
  );

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    setLoading(true);

    // Step 1: Local FAQ
    const result = fuse.search(text);
    if (result.length > 0) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", text: result[0].item.answer },
      ]);
      setInput("");
      setLoading(false);
      return;
    }

    // Step 2: Hugging Face API Fallback
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const botReply =
        data?.generated_text ||
        data?.error ||
        "Sorry — I couldn’t generate a helpful answer. Try rephrasing, or contact a nearby NGO.";

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", text: botReply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "I couldn’t reach the AI service. You can try again or use the Nearby NGOs page to contact a rescue.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Ask the Hope chatbot</h1>
          <p className="text-muted-foreground max-w-2xl">
            Quick guidance for stray animal care (first-aid, food habits, when to call
            an NGO). This is not a substitute for a vet.
          </p>
        </div>
        <div className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          If it’s urgent, go to <span className="text-foreground font-medium">Nearby NGOs</span>{" "}
          and call a rescue.
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-sm">
          <CardContent className="flex h-[520px] flex-col p-0">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Bot className="size-5 text-muted-foreground" />
              <div className="font-medium">Chat</div>
              {loading ? (
                <div className="ml-auto text-xs text-muted-foreground">Thinking…</div>
              ) : null}
            </div>

            <ScrollArea className="flex-1 px-5 py-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
                    Start by choosing a suggestion on the right, or ask your own question.
                  </div>
                ) : null}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {msg.role === "bot" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}

                {loading ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-secondary px-4 py-2 text-sm text-secondary-foreground shadow-sm">
                      Typing…
                    </div>
                  </div>
                ) : null}
                <div ref={listRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about animal care…"
                  onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                  disabled={loading}
                />
                <Button onClick={sendMessage} disabled={loading} className="gap-2">
                  <SendHorizonal className="size-4" />
                  Send
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Safety note: approach carefully; avoid bites/scratches; wash hands after contact.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" />
              <div className="text-sm font-medium">Suggested questions</div>
            </div>
            <div className="grid gap-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  className="h-auto justify-start whitespace-normal text-left"
                  onClick={() => setInput(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
            <div className="rounded-lg border bg-secondary/40 p-4 text-xs text-muted-foreground">
              If you share details, include a landmark, symptoms (bleeding, limping, not eating),
              and a photo if safe. For immediate rescue, use the Nearby NGOs page.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
