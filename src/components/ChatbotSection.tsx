import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatbotSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-6 md:grid-cols-2 md:items-center">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              “Our Golu is not eating for a few days and seems weak… what should I do?”
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">
              Get quick insights for stray animal care
            </h2>
            <p className="text-muted-foreground">
              Ask about basic first-aid, food habits, and when to call a rescue. (For
              emergencies, always contact an NGO or a vet.)
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="gap-2">
                <Link href="/chatbot">
                  <MessageCircle className="size-4" />
                  Open chatbot
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/ngos">Find NGOs near me</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-secondary to-background p-6">
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">Try asking</div>
              <div className="space-y-2">
                {[
                  "A stray dog has a bleeding paw—what can I do until help arrives?",
                  "What should I feed a weak stray cat?",
                  "How do I safely approach an injured animal?",
                ].map((t) => (
                  <div
                    key={t}
                    className="rounded-lg bg-background/70 px-3 py-2 text-sm"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}