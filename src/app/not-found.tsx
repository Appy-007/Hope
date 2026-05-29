import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-sm font-medium text-muted-foreground">404</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        The page you’re looking for doesn’t exist. You can go back to the home page or use the
        navigation menu.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/ngos">Nearby NGOs</Link>
        </Button>
      </div>
    </main>
  );
}

