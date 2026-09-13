import Image from "next/image";

export function Frame({
  src,
  alt,
  ratio = "aspect-[4/3]",
  sizes = "(min-width: 768px) 42vw, 100vw",
  priority = false,
  fillParent = false,
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  fillParent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        fillParent
          ? `absolute inset-0 overflow-hidden ${className}`
          : `relative overflow-hidden ${ratio} ${className}`
      }
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
    </div>
  );
}
