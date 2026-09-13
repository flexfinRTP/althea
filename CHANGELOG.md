# Changelog

## Unreleased

### Added

- ETHOnline 16:9 cover at `public/brand/althea-ethonline-cover.png`: tagline "Before the bill becomes debt" in olive on cream, official flower off the final t.
- ETHOnline 16:9 pitch slides at `/pitch` and `/pitch/close`. Open is the problem: $220B medical debt, 20M adults, $2.7B billed after they likely qualified, 240-day apply clock (KFF / CFPB / IRS). Close is centered $1,970, the hospital/relief/remain bar, and World / Privy / Circle / Arc.
- Althea Relief Network: match vaults, grant escrow (`approved → reserved → settled` / `refunded`), multi-funder waterfall, restricted fund accounting, foundation console (`/funders`), give-from-any-chain (`/fund/give`), automatic match campaigns, Privy policy-caged funder and agent wallets, Circle CCTP/Gateway, and optional The Graph index when `GRAPH_SUBGRAPH_URL` is set.
- `AltheaReliefNetwork` contract, `npm run deploy:network:arc:testnet`, and subgraph events for program, reserve, match, settle, and refund.
- Patient relief assembly `$250` general + `$250` Community Health Match = `$500`. Program max grant stays `$500`.
- Shared Zod validation for Check My Bill, treasury amount, and all request bodies. Per-field errors on blur and submit. Same rules on the API.
- Homepage and `/how` section photographs in `public/marketing/`: bill, policy, application, relief, privacy, architecture still-life, and CTA. Cream still-life, no extra copy.
- Official Althea lockup and mark (`althea-16-no-tagline`) on header, footer, print packet, loader, favicon, and Open Graph.
- App loader with Althea mark, operational status text, and the offchain / Arc USDC split. Route `loading.tsx` screens plus in-page fetches.
- `/how` is a full marketing page: generated architecture flow, two-system cards, stage copy, privacy split.
- Prisma live store is a local SQLite file at `.data/althea.db`. No Postgres install. `npm run dev` creates and seeds it.
- `GET`/`PATCH /api/relief/program`, `GET /api/relief/:id`, `POST /api/cases/:id/hospital-decision`.
- Signed session cookies, live treasury USDC reads, live duplicate-risk checks, docs-contract and live-case-value tests.
- Patient marketing homepage, demo case id `demo`, bill-reduction animation, sequential Relief Agent trace, policy source viewer, `/how`, printable application packet.
- `PATCH /api/cases/:id`, `/api/demo/bootstrap`, IAltheaReliefPool, deploy `setProgramCap` / `setAuthorizedExecutor`, IERC20 fund script.
- Riverside Community Hospital fixture (insured patients not eligible).
- Prisma SQL init migration, skip-link, `error.tsx` / `not-found.tsx`.
- `GET /api/public/grants` lists public grant proofs (amount, status, hash). No case or patient fields.
- `GET /api/treasury/transactions` returns stored fund txs plus grant releases for the treasury ledger.

### Changed

- Root Privy provider skips or catches an invalid `NEXT_PUBLIC_PRIVY_APP_ID` (including a World `app_` prefix) so `/check` and other pages do not 500.
- Money and household fields drop letters as you type. Donate and funder amounts use the same sanitizer and Zod rules as Check My Bill instead of `Number()`.
- `not-found` Home control uses Next `Link` so `next build` lint passes.
- World verify page uses IDKit `RpContext` (`created_at` / `expires_at` as unix seconds) so `next build` type-check passes.
- `/how` is the architecture flowchart and copy page again: one Fig. 1 rail diagram, text stage cards, no still-life photographs. Homepage photographs are unchanged.
- Pitch close footer uses the Ethereum diamond + ethereum wordmark on a white pill. The source banner had no recoverable word pixels; the wordmark is rebuilt from that diamond.
- Pitch close remaining figure rolls $18,420 → $1,970, then pops. No fade.
- Pitch close headline is the Relief Network line. The hospital-already-had-it line is removed.
- Pitch open lockup is 24em on the right. Left type is a step smaller.
- Pitch open names financial assistance on the 240-day and $2.7B lines, with KFF / CFPB / IRS after each figure.
- Pitch open is the national problem statement from `docs/business_marketing.md` and `docs/research_evidence.md`, not the demo $18,420 bill. Cream lockup stays large on the right. Close is full-stage, centered.
- Homepage and `/how` restored to the photographed marketing pages (numbered hero, section images, existing copy). Relief Network is one added section on each page.
- Homepage copy and number layout restored: hero is the bill-reduction estimate again. Section photos stay in `public/marketing/` and on `/how`. No copy rewrite.
- Demo mode banner is removed from site chrome. Header starts at the logo row.
- Relief Fund is a public-style ledger: available capital, delivered split, pool facts, testnet, grant proofs, and verify. Matches Endaoment / GiveDirectly layout, Althea type and color.
- Treasury is a public-style ledger: total USDC, allocation bar, holdings with copy/explorer, policy, activity, and fund controls. `GET /api/treasury/transactions` lists fund txs and grant releases.
- Type is Plus Jakarta Sans on marketing and the app. One family, no serif pair. Body sits at 17px with open leading.
- Brand palette is cream `#F3EDDD`, olive green `#5C5C38`, and logo gold `#C9A45A` / `#EDD4A4` on the app and marketing site.
- Circle logo black field is transparent. Partner marks sit in circles.
- Patient, admin, and fund UIs read amounts, hospitals, programs, billing offices, and policy source from APIs/fixtures. Demo numbers are no longer hardcoded in screens.
- Simulated hospital decisions and relief requests use the stored estimate and program caps instead of fixed `$15,950` / `$500` literals.
- World RP context returns `signature`. Grant execution refuses the zero provider address.
- Site chrome uses a sticky header, pill Check My Bill action, full-bleed home layout, and a footer on every page.
- `docs/` is gitignored. Operator name removed from README, env example, and local docs.

### Existing

- Next.js / TypeScript / Tailwind scaffold for Althea Care.
- Versioned 2026 HHS Federal Poverty Guideline tables.
- Example Medical Center demonstration Financial Assistance Policy fixture.
- Deterministic FAP eligibility engine, FPL calculator, and federal timeline engine.
- PostgreSQL Prisma schema plus local JSON store fallback.
- REST API matching the documented data model.
- Patient journey, World Selfie Check, Relief rules, Privy treasury, Circle Relief Agent, Arc ReliefPool.
- Contract tests, unit tests, testnet/mainnet deploy scripts.
