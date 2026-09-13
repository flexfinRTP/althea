"use client";

import { useState } from "react";
import { explorerAddress, shortenAddress } from "@/lib/arc/chain";

export function ChainAddress({
  value,
  label,
}: {
  value?: string | null;
  label: string;
}) {
  const address = value;
  const [copied, setCopied] = useState(false);
  if (!address) return <span className="text-muted">Not configured</span>;
  const href = explorerAddress(address);

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 font-mono text-sm">
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4">
          {shortenAddress(address)}
        </a>
      ) : (
        <span>{shortenAddress(address)}</span>
      )}
      <button
        type="button"
        className="font-sans text-xs uppercase tracking-wide text-muted hover:text-ink"
        onClick={copy}
        aria-label={`Copy ${label}`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
