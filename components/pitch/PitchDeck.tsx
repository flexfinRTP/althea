"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PitchStage } from "@/components/pitch/PitchStage";

export function PitchDeck({
  slide,
  children,
}: {
  slide: "open" | "close";
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (slide === "open") router.push("/pitch/close");
      }
      if (event.key === "ArrowLeft" || event.key === "Backspace") {
        event.preventDefault();
        if (slide === "close") router.push("/pitch");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, slide]);

  return (
    <PitchStage onAdvance={slide === "open" ? () => router.push("/pitch/close") : undefined}>
      {children}
    </PitchStage>
  );
}
