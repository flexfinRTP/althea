import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-cream-elev">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo variant="lockup" size="lg" />
          <p className="mt-3 text-sm leading-6 text-muted">Before the bill becomes debt.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted" aria-label="Footer">
          <Link href="/check">Check My Bill</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/how">How Althea works</Link>
          <Link href="/fund">Relief Fund</Link>
          <Link href="/fund/give">Give</Link>
          <Link href="/funders">Funders</Link>
          <Link href="/admin/treasury">Treasury</Link>        </nav>
      </div>
    </footer>
  );
}
