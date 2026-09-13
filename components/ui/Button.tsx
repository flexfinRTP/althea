import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { pillGhostClass, pillGoldClass, pillPrimaryClass } from "@/components/app/chrome";

type Variant = "primary" | "ghost" | "gold";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={twMerge(
        variant === "ghost" ? pillGhostClass : variant === "gold" ? pillGoldClass : pillPrimaryClass,
        className,
      )}
      {...props}
    />
  );
}
