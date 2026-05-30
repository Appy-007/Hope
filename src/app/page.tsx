import ChatbotSection from "@/components/ChatbotSection";
import HeroSection2 from "@/components/HeroSection2";
import LandingPage from "@/components/LandingPage";
import Vaccination from "@/components/Vaccination";
import SummerCareSection from "@/components/SummerCareSection";
import NgoEnlistSection from "@/components/NgoEnlistSection";
import DisclaimerSection from "@/components/DisclaimerSection";
import Image from "next/image";
import Link from "next/link";
import AnimalCareLogo from "@/assets/animalcarelogo.png"
import PeopleForAnimalsLogo from "@/assets/Ashari-Kolkata.png"
import AnimalPeopleAllianceLogo from "@/assets/animal-people-alliance-kolkata.png"
import LikeADogLogo from "@/assets/LikeADog.png"

import { KOLKATA_NGOS } from "@/data/kolkataNgos";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export default function Home() {
  const featuredNgos = KOLKATA_NGOS.slice(0, 4);
  const ngoImages = [
    AnimalCareLogo,
    PeopleForAnimalsLogo,
   AnimalPeopleAllianceLogo,
    LikeADogLogo,
  ];

  return (
    <>
    <LandingPage/>
    <ChatbotSection/>
    <HeroSection2/>
    <SummerCareSection/>
    <Vaccination/>

    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Quick NGO contacts</h2>
          <p className="text-muted-foreground max-w-2xl">
            If you’ve found an injured stray, reach out to an NGO for guidance and rescue help.
          </p>
        </div>
        <Button asChild className="md:self-end">
          <Link href="/contacts">View all contacts</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featuredNgos.map((ngo, idx) => (
          <Card key={ngo.id} className="overflow-hidden">
            <div className="relative h-36 w-full">
              <Image
                src={ngoImages[idx % ngoImages.length]}
                alt="Rescued stray animal"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <CardHeader className="space-y-1">
              <CardTitle className="line-clamp-2 text-base">{ngo.name}</CardTitle>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {ngo.areaHint ?? "Kolkata"}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {ngo.phone ? (
                <div className="text-muted-foreground">
                  <span className="text-foreground font-medium">Phone:</span>{" "}
                  <a className="underline underline-offset-4" href={`tel:${ngo.phone}`}>
                    {ngo.phone}
                  </a>
                </div>
              ) : null}
              {ngo.email ? (
                <div className="text-muted-foreground">
                  <span className="text-foreground font-medium">Email:</span>{" "}
                  <a className="underline underline-offset-4" href={`mailto:${ngo.email}`}>
                    {ngo.email}
                  </a>
                </div>
              ) : null}
              {ngo.website ? (
                <div className="text-muted-foreground">
                  <span className="text-foreground font-medium">Website:</span>{" "}
                  <a className="underline underline-offset-4" href={ngo.website} target="_blank">
                    {ngo.website}
                  </a>
                </div>
              ) : null}
              <div className="text-xs text-muted-foreground line-clamp-2">{ngo.address}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
    <NgoEnlistSection/>
    <DisclaimerSection/>
    
    </>
  );
}
