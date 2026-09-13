"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { arcTestnet } from "@/lib/arc/chain";

export function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!appId) {
    return <>{children}</>;
  }
  return (
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
          accentColor: "#1f4a43",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
