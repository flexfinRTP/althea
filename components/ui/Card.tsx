import { twMerge } from "tailwind-merge";
import { cardSurfaceClass } from "@/components/app/chrome";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={twMerge(cardSurfaceClass, className)}>{children}</section>;
}
