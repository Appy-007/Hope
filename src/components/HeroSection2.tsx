import Link from "next/link";
import { MapPin, PhoneCall, ShieldPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HeroSection2() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">
            Reach out to your nearest NGO — just a call away
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Use your location to find nearby rescues, get contact numbers, and open
            directions instantly.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/ngos">
            <MapPin className="size-4" />
            Find nearby NGOs
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PhoneCall className="size-4" />
              Call faster
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            One-tap call buttons with address and website links.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-4" />
              Share location
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            When you contact an NGO, share landmarks and a clear photo if safe.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldPlus className="size-4" />
              Safer first-aid
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Use the chatbot for quick guidance while you arrange rescue.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}