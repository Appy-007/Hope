"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { MapPin, Navigation, Phone, ExternalLink, Copy } from "lucide-react";

import { KOLKATA_NGOS, type Ngo } from "@/data/kolkataNgos";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type LatLng = { lat: number; lng: number };

function toRad(v: number) {
  return (v * Math.PI) / 180;
}

function distanceKm(a: LatLng, b: LatLng) {
  // Haversine
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const fuse = new Fuse(KOLKATA_NGOS, {
  threshold: 0.35,
  ignoreLocation: true,
  keys: ["name", "address", "areaHint", "tags", "description"],
});

export default function NgoFinderPage() {
  const [query, setQuery] = useState("");
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [locStatus, setLocStatus] = useState<
    "idle" | "requesting" | "granted" | "denied" | "error"
  >("idle");
  const [locError, setLocError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = useMemo(() => {
    const base: Ngo[] = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : KOLKATA_NGOS;

    const enriched = base.map((ngo) => {
      const km = userLoc ? distanceKm(userLoc, ngo.location) : null;
      return { ngo, km };
    });

    enriched.sort((x, y) => {
      if (x.km == null && y.km == null) return x.ngo.name.localeCompare(y.ngo.name);
      if (x.km == null) return 1;
      if (y.km == null) return -1;
      return x.km - y.km;
    });

    return enriched;
  }, [query, userLoc]);

  const requestLocation = async () => {
    setLocError(null);
    setLocStatus("requesting");

    if (!("geolocation" in navigator)) {
      setLocStatus("error");
      setLocError("Geolocation is not supported in this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("granted");
      },
      (err) => {
        setLocStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
        setLocError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can still browse NGOs and search by area."
            : "Couldn’t get your location. Try again or search by area."
        );
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 30_000 }
    );
  };

  const onCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // no-op
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Find nearby animal NGOs in Kolkata
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Use your location to sort by distance, or search by area (e.g.
            “Thakurpukur”, “Sarsuna”, “South Kolkata”).
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            onClick={requestLocation}
            disabled={locStatus === "requesting"}
            className="gap-2"
          >
            <Navigation className="size-4" />
            {locStatus === "requesting" ? "Getting location…" : "Use my location"}
          </Button>
        </div>
      </div>

      {(locError || userLoc) && (
        <div className="mt-4 rounded-lg border bg-card px-4 py-3 text-sm">
          {userLoc ? (
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              <span>
                Using your location ({userLoc.lat.toFixed(4)}, {userLoc.lng.toFixed(4)})
                to sort results.
              </span>
              <Button
                variant="ghost"
                className="h-7 px-2"
                onClick={() => setUserLoc(null)}
              >
                Clear
              </Button>
            </div>
          ) : (
            <div className="text-muted-foreground">{locError}</div>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xl">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NGOs by name, area, tags…"
          />
        </div>
        <div className="text-muted-foreground text-sm">
          Showing <span className="text-foreground font-medium">{results.length}</span>{" "}
          result(s)
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {results.map(({ ngo, km }) => (
          <Card key={ngo.id} className="h-full">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-start justify-between gap-3">
                <span className="leading-tight">{ngo.name}</span>
                {km != null && (
                  <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">
                    {formatKm(km)}
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-sm">{ngo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm">
                <div className="text-muted-foreground">Address</div>
                <div className="flex items-start justify-between gap-3">
                  <div className="leading-relaxed">{ngo.address}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onCopy(ngo.id, ngo.address)}
                    aria-label="Copy address"
                    title="Copy address"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
                {copiedId === ngo.id && (
                  <div className="text-xs text-muted-foreground">Copied</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {ngo.tags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {ngo.phone && (
                  <Button asChild className="gap-2">
                    <a href={`tel:${ngo.phone}`}>
                      <Phone className="size-4" />
                      Call
                    </a>
                  </Button>
                )}
                {ngo.website && (
                  <Button asChild variant="outline" className="gap-2">
                    <a href={ngo.website} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                      Website
                    </a>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        ngo.address
                      )}`,
                      "_blank",
                      "noreferrer"
                    )
                  }
                >
                  <MapPin className="size-4" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        Distances are estimates. If an animal is in immediate danger, call an NGO and
        share the exact landmark and a photo if possible.
      </div>
    </main>
  );
}

