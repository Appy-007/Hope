import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";

import { KOLKATA_NGOS } from "@/data/kolkataNgos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Contacts() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground max-w-2xl">
            If you spot a hurt or sick stray in Kolkata, the fastest help is usually a
            nearby rescue/NGO. Keep yourself safe first.
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
            <CardTitle className="text-base">What to share on call</CardTitle>
            <CardDescription>Helps rescuers reach faster</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>- Exact landmark + nearest cross road</div>
            <div>- Symptoms (bleeding, limping, not eating, etc.)</div>
            <div>- Photo/video if safe</div>
            <div>- Your callback number</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Safety checklist</CardTitle>
            <CardDescription>Protect yourself and others</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>- Approach slowly; avoid bites/scratches</div>
            <div>- Use cloth/cardboard as a barrier if needed</div>
            <div>- Keep kids and pets away</div>
            <div>- Wash hands after contact</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick guidance</CardTitle>
            <CardDescription>While you arrange rescue</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <div>
              Use the chatbot for basic first-aid and feeding tips (not a substitute
              for a vet).
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href="/chatbot">Open chatbot</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Kolkata NGO directory</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {KOLKATA_NGOS.map((ngo) => (
            <Card key={ngo.id}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{ngo.name}</CardTitle>
                <CardDescription>{ngo.address}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {ngo.phone ? (
                  <Button asChild size="sm" className="gap-2">
                    <a href={`tel:${ngo.phone}`}>
                      <Phone className="size-4" />
                      Call
                    </a>
                  </Button>
                ) : null}
                {ngo.website ? (
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a href={ngo.website} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                      Website
                    </a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}