export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-gold bg-gold-soft/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-green">
      {children}
    </span>
  );
}
