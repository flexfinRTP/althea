# Changelog

## Unreleased

### Added

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

- Homepage Relief Rail sits above the No loans section. No loans uses cream-2 so the bands still alternate.
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
