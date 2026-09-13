import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const variant = props.variant ?? "primary";
  const { variant: _ignored, ...rest } = props as ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
  };
  return (
    <button
      className={twMerge(
        "inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition disabled:opacity-50",
        variant === "primary"
          ? "bg-green text-cream-elev hover:bg-green-2"
          : "border border-line bg-cream-elev text-ink hover:bg-cream",
        className,
      )}
      {...rest}
    />
  );
}
