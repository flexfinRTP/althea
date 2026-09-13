import type { Metadata } from "next";
import { OpenSlide } from "@/components/pitch/OpenSlide";
import { PitchDeck } from "@/components/pitch/PitchDeck";

export const metadata: Metadata = {
  title: "Althea — Open",
  robots: { index: false, follow: false },
};

export default function PitchOpenPage() {
  return (
    <PitchDeck slide="open">
      <OpenSlide />
    </PitchDeck>
  );
}
