"use client";

import { useEffect } from "react";

export function PitchStage({
  children,
  onAdvance,
}: {
  children: React.ReactNode;
  onAdvance?: () => void;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  return (
    <div className="pitch-letterbox">
      <div
        className={`pitch-stage ${onAdvance ? "cursor-pointer" : ""}`}
        role="group"
        aria-label="Pitch slide"
        onClick={onAdvance}
      >
        {children}
      </div>
    </div>
  );
}
