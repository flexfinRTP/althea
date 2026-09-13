"use client";

export function ExplainDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20" role="dialog" aria-modal="true" aria-label="Why am I seeing this?">
      <button className="h-full flex-1 cursor-default" onClick={onClose} aria-label="Close explanation" />
      <aside className="h-full w-full max-w-md overflow-y-auto border-l border-[#e3d9c8] bg-[#fffdf8] p-6">
        {children}
      </aside>
    </div>
  );
}
