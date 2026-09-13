"use client";

import { usePathname } from "next/navigation";
import { isMarketingPath, isPitchPath, isWideAppPath } from "@/components/layout/paths";

export function MainFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const marketing = isMarketingPath(pathname);
  const wide = isWideAppPath(pathname);
  const pitch = isPitchPath(pathname);
  return (
    <main
      id="main"
      className={
        pitch
          ? "p-0"
          : marketing
            ? "w-full"
            : wide
              ? "mx-auto max-w-6xl px-6 py-10"
              : "mx-auto max-w-5xl px-6 py-10"
      }
    >
      {children}
    </main>
  );
}
