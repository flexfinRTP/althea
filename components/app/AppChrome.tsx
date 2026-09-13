import Link from "next/link";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  kickerClass,
  pageLeadClass,
  pageTitleClass,
  pillGhostClass,
  pillGoldClass,
  pillPrimaryClass,
} from "@/components/app/chrome";

export function AppPage({
  kicker,
  title,
  lead,
  aside,
  children,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="min-w-0">
          {kicker ? <p className={kickerClass}>{kicker}</p> : null}
          <h1 className={twMerge(kicker ? "mt-3" : undefined, pageTitleClass)}>{title}</h1>
          {lead ? <div className={pageLeadClass}>{lead}</div> : null}
        </div>
        {aside ? <div className="flex flex-wrap items-center gap-2">{aside}</div> : null}
      </header>
      {children}
    </div>
  );
}

export function AppError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-2xl border border-danger/25 bg-cream-elev px-5 py-4 text-sm text-danger" role="alert">
      {children}
    </p>
  );
}

export function AppLink({
  href,
  variant = "primary",
  className,
  children,
  external,
}: {
  href: string;
  variant?: "primary" | "ghost" | "gold";
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const classes = twMerge(
    variant === "ghost" ? pillGhostClass : variant === "gold" ? pillGoldClass : pillPrimaryClass,
    className,
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function AppNavCard({
  href,
  label,
  kicker,
}: {
  href: string;
  label: string;
  kicker?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[2rem] border border-line/80 bg-cream-elev p-6 transition hover:border-gold hover:bg-gold-soft/25"
    >
      {kicker ? <p className={kickerClass}>{kicker}</p> : null}
      <p className={twMerge("text-xl tracking-tight text-green", kicker ? "mt-2" : undefined)}>{label}</p>
    </Link>
  );
}

export function FactRow({
  label,
  value,
  emphasize = false,
}: {
  label: ReactNode;
  value: ReactNode;
  emphasize?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex items-baseline justify-between gap-4",
        emphasize ? "border-t border-line pt-5" : undefined,
      )}
    >
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

export function ActionRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

export function StatusList({
  items,
  current,
}: {
  items: string[];
  current?: string;
}) {
  const currentIndex = current ? items.indexOf(current) : -1;
  return (
    <ol className="space-y-2">
      {items.map((item, index) => {
        const active = item === current;
        const done = currentIndex >= 0 && index < currentIndex;
        return (
          <li
            key={item}
            className={twMerge(
              "flex items-center gap-3 rounded-2xl px-4 py-3",
              active ? "bg-gold-soft/50 text-green" : done ? "text-ink" : "text-muted",
            )}
          >
            <span
              className={twMerge(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                active ? "bg-green text-gold-soft" : done ? "bg-gold text-green" : "bg-cream-2 text-muted",
              )}
            >
              {index + 1}
            </span>
            <span className={active ? "font-medium" : undefined}>{item.replaceAll("_", " ")}</span>
          </li>
        );
      })}
    </ol>
  );
}
