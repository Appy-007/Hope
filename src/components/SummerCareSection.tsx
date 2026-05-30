import Image from "next/image";
import Link from "next/link";
import { Sun, Droplets, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import summerImage from "@/assets/pexels-soumyadip-adak-398670506-14930773.jpg";
import CrowImage from "@/assets/Crow_optimized.jpg"

export default function SummerCareSection() {
  const tips = [
    {
      title: "Place Fresh Water Bowls",
      description: "Keep clean earthenware bowls filled with water in shaded areas outside your house or shop. Refill them twice a day.",
    },
    {
      title: "Provide Shaded Safe Havens",
      description: "Allow stray dogs and cats to rest under the shade of your compound wall, shops, or parked cars during peak afternoon heat (12 PM - 4 PM).",
    },
    {
      title: "Recognize Heatstroke Symptoms",
      description: "Excessive panting, red gums, weakness, or vomiting are signs of heat distress. Wet their paws and tummy immediately with cool water.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="grid gap-8 p-8 md:grid-cols-12 md:items-center lg:p-12">
          
          {/* Image Container (Left on desktop) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:col-span-5 md:order-first md:aspect-square">
            <Image
              src={CrowImage}
              alt="Stray dog seeking shade or resting in Kolkata heat"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
        
          </div>

          {/* Text Content (Right on desktop) */}
          <div className="space-y-6 md:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-500">
              <Sun className="size-3.5 animate-pulse text-amber-500" />
              Summer Stray Care (Kolkata Guidelines)
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Beating the Heat: Help Strays Survive Kolkata Summers
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Kolkata’s summer temperatures regularly cross 40°C, making life incredibly difficult for street animals. A few simple actions can save lives.
              </p>
            </div>

            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Droplets className="size-3.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group gap-2 rounded-xl text-sm font-medium">
                <Link href="/chatbot">
                  <MessageCircle className="size-4 transition-transform group-hover:scale-110" />
                  Ask AI Chatbot for Summer Care Guide
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
