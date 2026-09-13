export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[#e3d9c8] px-2.5 py-1 text-xs uppercase tracking-wide text-[#5c564c]">
      {children}
    </span>
  );
}
