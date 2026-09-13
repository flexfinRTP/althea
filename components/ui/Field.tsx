export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm text-[#5c564c]">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-[#e3d9c8] bg-white px-3 py-2 text-[#1c1915]";
