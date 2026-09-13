import Link from "next/link";
import { MainFrame } from "@/components/layout/MainFrame";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Logo } from "@/components/brand/Logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream-elev focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-cream-elev/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
          <Logo variant="lockup" size="md" />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Primary">
            <Link href="/how">How Althea works</Link>
            <Link href="/fund">Relief Fund</Link>
            <Link href="/admin/treasury">Treasury</Link>
          </nav>
          <Link
            href="/check"
            className="inline-flex rounded-full bg-green px-5 py-2.5 text-sm font-medium text-cream-elev hover:bg-green-2"
          >
            Check My Bill
          </Link>
        </div>
        <nav
          className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-6 pb-3 text-sm text-muted md:hidden"
          aria-label="Mobile"
        >
          <Link href="/how">How Althea works</Link>
          <Link href="/fund">Relief Fund</Link>
          <Link href="/admin/treasury">Treasury</Link>
        </nav>
      </header>
      <MainFrame>{children}</MainFrame>
      <SiteFooter />
    </div>
  );
}
