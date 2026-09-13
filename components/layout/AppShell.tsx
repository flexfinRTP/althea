import Link from "next/link";
import { DemoBanner } from "@/components/layout/DemoBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[#fffdf8] focus:px-3 focus:py-2">
        Skip to content
      </a>
      <DemoBanner />
      <header className="border-b border-[#e3d9c8] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight">
            Althea
          </Link>
          <nav className="flex gap-5 text-sm text-[#5c564c]" aria-label="Primary">
            <Link href="/check">Check My Bill</Link>
            <Link href="/how">How Althea works</Link>
            <Link href="/fund">Relief Fund</Link>
            <Link href="/admin/treasury">Treasury</Link>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
