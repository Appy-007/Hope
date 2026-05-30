import Image from "next/image";
import Link from "next/link";
import { Syringe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import vaccination_image from "../assets/street-dogs-5903305_640.jpg";


export default function Vaccination() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="grid gap-8 p-8 md:grid-cols-12 md:items-center lg:p-12">
          
          {/* Text Content (Left on desktop) */}
          <div className="space-y-6 md:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Syringe className="size-3.5" />
              Vaccination & Sterilization (ABC)
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Protect & Stabilize: Immunization & Animal Birth Control
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Combining rabies immunization with sterilization is key to keeping stray populations healthy, stable, and peaceful in our neighborhoods.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <span className="text-xs font-bold">1</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Organize local drives</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Contact local NGOs or municipal authorities to run regular anti-rabies vaccination (ARV) camps in your area.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <span className="text-xs font-bold">2</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Support Animal Birth Control (ABC)</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Sterilization is the only court-mandated, humane method in India to manage stray dog populations. It curbs territorial behavior, mating-season aggression, and puppy mortality.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <span className="text-xs font-bold">3</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">Understand the Law (ABC Rules)</h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Relocating street dogs is illegal under Indian law. Dogs must be caught by certified handlers, sterilized/vaccinated by local bodies/NGOs, and released back into the exact same locality.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group gap-2 rounded-xl text-sm font-medium">
                <Link href="/ngos">
                  Find Vaccination & ABC NGOs
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Container (Right on desktop) */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:col-span-5 md:aspect-square">
            <Image
              src={vaccination_image}
              alt="Street dogs needing vaccination"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

