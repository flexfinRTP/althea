import Image from "next/image";
import Link from "next/link";

const files = {
  lockup: { src: "/brand/althea-logo.png", width: 665, height: 663 },
  mark: { src: "/brand/althea-mark.png", width: 382, height: 408 },
} as const;

const heights = {
  sm: { lockup: 44, mark: 32 },
  md: { lockup: 56, mark: 40 },
  lg: { lockup: 96, mark: 72 },
} as const;

export function Logo({
  variant = "lockup",
  size = "md",
  href = "/",
  className = "",
}: {
  variant?: keyof typeof files;
  size?: keyof typeof heights;
  href?: string | null;
  className?: string;
}) {
  const file = files[variant];
  const height = heights[size][variant];
  const width = Math.round((file.width / file.height) * height);
  const image = (
    <Image
      src={file.src}
      alt="Althea"
      width={width}
      height={height}
      className={`w-auto ${className}`.trim()}
      style={{ height }}
      priority={size !== "lg"}
    />
  );

  if (!href) return image;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="Althea home">
      {image}
    </Link>
  );
}
