"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/", label: "Home" },
  { href: "/ngos", label: "Nearby NGOs", icon: MapPin },
  { href: "/chatbot", label: "Chatbot", icon: MessageCircle },
  { href: "/contacts", label: "Contacts" },
  { href: "/enlist", label: "Enlist NGO" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            H
          </span>
          <span className="font-semibold tracking-tight">Hope</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            const Icon = "icon" in item ? item.icon : null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="relative flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/ngos">Find help near me</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/chatbot">Ask now</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          {mobileOpen ? (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border bg-background shadow-lg md:hidden">
              <div className="flex flex-col p-1">
                {nav.map((item) => {
                  const active =
                    item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                  const Icon = "icon" in item ? item.icon : null;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {Icon ? <Icon className="size-4" /> : null}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}