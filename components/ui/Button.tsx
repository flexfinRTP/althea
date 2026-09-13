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
          ? "bg-[#1f4a43] text-[#fffdf8] hover:bg-[#2f6a60]"
          : "border border-[#e3d9c8] bg-[#fffdf8] text-[#1c1915] hover:bg-[#f6f1e8]",
        className,
      )}
      {...rest}
    />
  );
}
