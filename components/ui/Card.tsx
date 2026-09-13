export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-line bg-cream-elev p-6 ${className}`}>
      {children}
    </section>
  );
}
