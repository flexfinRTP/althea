import Link from "next/link";
import { DemoBanner } from "@/components/layout/DemoBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DemoBanner />
      <header className="border-b border-[#e3d9c8] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-medium tracking-tight">
            Althea
          </Link>
          <nav className="flex gap-5 text-sm text-[#5c564c]">
            <Link href="/check">Check My Bill</Link>
            <Link href="/fund">Relief Fund</Link>
            <Link href="/admin/treasury">Treasury</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
