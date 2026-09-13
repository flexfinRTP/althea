export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-gold-soft px-2.5 py-1 text-xs uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}
