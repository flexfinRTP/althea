export default function HowPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl">How Althea works</h1>
      <section className="space-y-3">
        <h2 className="text-2xl">Two systems</h2>
        <p>Hospital Financial Assistance Navigator. No World. No chain. No wallets.</p>
        <p>Althea Relief Rail. World Selfie Check, Privy, Circle Agent Stack, Arc, USDC, ReliefPool.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl">Architecture</h2>
        <pre className="overflow-x-auto rounded-xl border border-[#e3d9c8] bg-[#fffdf8] p-6 text-sm leading-6">{`                    ALTHEA

                  Patient App
              Next.js / TypeScript
                       │
                       ▼
                Althea API
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
    FAP Intelligence          Case Workflow
          │                         │
     AI extraction                  │
          │                         │
    Structured rules                │
          │                         │
    Deterministic engine            │
          │                         │
          └────────────┬────────────┘
                       │
                Hospital Decision
                       │
                Residual Balance
                       │
                       ▼
                 ALTHEA RELIEF
                       │
               World Selfie Check
                       │
                       ▼
               Relief Rules Engine
                       │
                       ▼
               Circle Relief Agent
                       │
                  approval state
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
          Privy                 Arc
    organization control     ReliefPool
       + treasury              + USDC
             │                   │
             └─────────┬─────────┘
                       ▼
              Provider Settlement`}</pre>
      </section>
      <section className="space-y-2">
        <h2 className="text-2xl">Privacy</h2>
        <p>Never onchain: name, DOB, diagnosis, records, income, bills, insurance, selfie.</p>
        <p>Onchain: caseHash, programId, grantAmount, settlementAddress, decisionHash, status.</p>
      </section>
    </div>
  );
}
