"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { isPitchPath } from "@/components/layout/paths";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isPitchPath(pathname)) {
    return children;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-cream-elev/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
          <Logo variant="lockup" size="md" />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Primary">
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
      </header>
      {children}
      <SiteFooter />
    </>
  );
}
