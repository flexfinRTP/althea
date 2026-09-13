import { LogoMark } from "@/components/brand/LogoMark";
import {
  LOADER_FOOTNOTE,
  LOADER_HASH_CELLS,
  LOADER_PRIVACY,
  LOADER_RAIL,
  LOADER_RAIL_LABEL,
  LOADER_STACK,
  LOADER_STATUS,
  loaderAriaLabel,
} from "@/lib/ui/loader";

type AppLoaderProps = {
  status?: string;
  variant?: "full" | "inline";
};

export function AppLoader({
  status = LOADER_STATUS.default,
  variant = "full",
}: AppLoaderProps) {
  const label = loaderAriaLabel(status);

  if (variant === "inline") {
    return (
      <div
        className="althea-loader althea-loader-inline print:hidden"
        role="status"
        aria-label={label}
      >
        <LogoMark size={22} />
        <p className="text-sm text-muted">{status}</p>
      </div>
    );
  }

  return (
    <div
      className="althea-loader flex min-h-[50vh] flex-col items-center justify-center py-16 print:hidden"
      role="status"
      aria-label={label}
    >
      <LogoMark size={72} />
      <p className="mt-5 text-3xl font-semibold tracking-tight text-green">Althea</p>
      <p className="mt-2 text-sm font-medium text-muted">{status}</p>

      <div className="mt-10 grid w-full max-w-lg grid-cols-2 border border-ink">
        <article className="border-r border-ink px-5 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {LOADER_RAIL.hospital.title}
          </p>
          <p className="mt-3 text-xl tracking-tight">{LOADER_RAIL.hospital.layer}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{LOADER_RAIL.hospital.items.join(" · ")}</p>
        </article>
        <article className="px-5 py-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {LOADER_RAIL.relief.title}
          </p>
          <p className="mt-3 text-xl tracking-tight">{LOADER_RAIL.relief.layer}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{LOADER_RAIL.relief.items.join(" · ")}</p>
          <div className="althea-hash mt-4" aria-hidden="true">
            {Array.from({ length: LOADER_HASH_CELLS }, (_, i) => (
              <span key={i} className="althea-hash-cell" />
            ))}
          </div>
          <div className="althea-settle mt-3" aria-hidden="true">
            <span className="althea-settle-dot" />
          </div>
        </article>
      </div>

      <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {LOADER_RAIL_LABEL}
      </p>
      <ul className="mt-4 flex w-full max-w-lg flex-wrap items-end justify-between gap-x-3 gap-y-4">
        {LOADER_STACK.map((item) => (
          <li key={item.name} className="flex min-w-0 flex-col items-center gap-2">
            <img
              src={item.logo}
              alt={item.name}
              className="h-8 w-auto max-w-[4.75rem] object-contain"
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              {item.role}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">{LOADER_PRIVACY}</p>
      <p className="mt-1 text-sm text-muted">{LOADER_FOOTNOTE}</p>
    </div>
  );
}
