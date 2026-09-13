import type { Metadata } from "next";
import { CloseSlide } from "@/components/pitch/CloseSlide";
import { PitchDeck } from "@/components/pitch/PitchDeck";

export const metadata: Metadata = {
  title: "Althea — Close",
  robots: { index: false, follow: false },
};

export default function PitchClosePage() {
  return (
    <PitchDeck slide="close">
      <CloseSlide />
    </PitchDeck>
  );
}
