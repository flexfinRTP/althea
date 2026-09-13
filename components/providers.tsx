"use client";

import { Component, type ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { arcTestnet } from "@/lib/arc/chain";
import { publicPrivyAppId } from "@/lib/privy/app-id";

class PrivyGate extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = publicPrivyAppId();
  if (!appId) {
    return <>{children}</>;
  }
  return (
    <PrivyGate fallback={children}>
      <PrivyProvider
        appId={appId}
        config={{
          defaultChain: arcTestnet,
          supportedChains: [arcTestnet],
          embeddedWallets: {
            ethereum: {
              createOnLogin: "users-without-wallets",
            },
          },
          appearance: {
            theme: "light",
            accentColor: "#5c5c38",
          },
        }}
      >
        {children}
      </PrivyProvider>
    </PrivyGate>
  );
}
