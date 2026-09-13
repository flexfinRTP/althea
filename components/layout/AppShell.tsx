import { MainFrame } from "@/components/layout/MainFrame";
import { SiteChrome } from "@/components/layout/SiteChrome";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream-elev focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <SiteChrome>
        <MainFrame>{children}</MainFrame>
      </SiteChrome>
    </div>
  );
}
