import Link from "next/link";
import { Heart, Mail, MapPin, MessageCircle, Github } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted/40 text-muted-foreground transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                H
              </span>
              <span className="font-semibold tracking-tight">Hope</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Connecting animal lovers with NGOs and rescue resources in Kolkata. 
              Together, we can heal, rescue, and build a safer environment for our stray friends.
            </p>
            {/* Social / Info Links */}
            <div className="flex items-center gap-3.5 mt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="rounded-full p-2 bg-background hover:bg-accent hover:text-foreground border transition-all hover:scale-105"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
              <Link 
                href="/chatbot"
                className="rounded-full p-2 bg-background hover:bg-accent hover:text-foreground border transition-all hover:scale-105"
                aria-label="Chatbot Support"
              >
                <MessageCircle className="size-4" />
              </Link>
              <a 
                href="mailto:contact@hope-kolkata.org" 
                className="rounded-full p-2 bg-background hover:bg-accent hover:text-foreground border transition-all hover:scale-105"
                aria-label="Email support"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/ngos" className="hover:text-foreground transition-colors">
                  Nearby NGOs
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="hover:text-foreground transition-colors">
                  Emergency Chatbot
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-foreground transition-colors">
                  Quick NGO Contacts
                </Link>
              </li>
              <li>
                <Link href="/enlist" className="hover:text-foreground transition-colors">
                  Enlist Your NGO
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Rescue Tips */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Stray Emergency Tips</h3>
            <ul className="space-y-2 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Keep a safe distance from frightened/injured animals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Take a clear photo and video of the injury or location.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Note landmarks or street names for NGO rescuers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Offer clean drinking water if safe to do so.</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact/Disclaimer */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">About Our Mission</h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Kolkata, West Bengal, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <a href="mailto:info@hope-animalcare.org" className="hover:text-foreground transition-colors break-all">
                  info@hope-animalcare.org
                </a>
              </div>
              <div className="text-xs border-l-2 border-primary/50 pl-3 italic py-0.5">
                Hope is an open platform aggregating rescue contacts. Please contact specific NGOs directly for emergencies.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t bg-muted/60 py-6 text-xs text-muted-foreground/80">
        <div className="mx-auto max-w-6xl px-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <div>
            &copy; {currentYear} Hope. All rights reserved. Registered under Animal Welfare Aggregator guides.
          </div>
          <div className="flex items-center justify-center gap-1.5 text-foreground/70">
            <span>Made with</span>
            <Heart className="size-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>for Kolkata&apos;s stray animals</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
