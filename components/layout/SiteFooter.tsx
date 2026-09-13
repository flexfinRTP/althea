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
          <Link href="/check" className="hover:text-green">
            Check My Bill
          </Link>
          <Link href="/#how-it-works" className="hover:text-green">
            How it works
          </Link>
          <Link href="/how" className="hover:text-green">
            How Althea works
          </Link>
          <Link href="/fund" className="hover:text-green">
            Relief Fund
          </Link>
          <Link href="/fund/give" className="hover:text-green">
            Give
          </Link>
          <Link href="/funders" className="hover:text-green">
            Funders
          </Link>
          <Link href="/admin/treasury" className="hover:text-green">
            Treasury
          </Link>
        </nav>
      </div>
    </footer>
  );
}
