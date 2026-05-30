import Image from "next/image";
import Link from "next/link";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import cowImage from "@/assets/istockphoto-1336130472-612x612.webp";

export default function NgoEnlistSection() {
  const benefits = [
    "Receive direct rescue alerts from nearby citizens",
    "Manage your team's availability and active rescue zones",
    "Publish local vaccination drives and adoption alerts",
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border bg-card text-card-foreground shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="grid gap-8 p-8 md:grid-cols-12 md:items-center lg:p-12">
          {/* Text Content */}
          <div className="space-y-6 md:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <PlusCircle className="size-3.5" />
              For Rescue Teams & Vets
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Partner with Hope: Enlist Your NGO or Clinic
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg">
                Are you an animal shelter, street rescue group, or veterinary clinic? Join our network to streamline rescue coordination and connect with caretakers in Kolkata.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-muted-foreground sm:text-base">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button asChild size="lg" className="group gap-2 rounded-xl text-sm font-medium">
                <Link href="/enlist">
                  <PlusCircle className="size-4 transition-transform group-hover:scale-110" />
                  Enlist Your Organization
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:col-span-5 md:aspect-square">
            <Image
              src={cowImage}
              alt="Veterinary doctor examining a rescue dog"
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
