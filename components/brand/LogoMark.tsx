/** Company mark. Keep aria-label="Althea". */

import Image from "next/image";

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 40, className = "" }: LogoMarkProps) {
  return (
    <Image
      src="/brand/althea-mark.png"
      alt="Althea"
      width={size}
      height={size}
      className={`w-auto ${className}`.trim()}
      style={{ height: size, width: "auto" }}
      aria-label="Althea"
    />
  );
}
