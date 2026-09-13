export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-[#e3d9c8] bg-[#fffdf8] p-6 ${className}`}>
      {children}
    </section>
  );
}
