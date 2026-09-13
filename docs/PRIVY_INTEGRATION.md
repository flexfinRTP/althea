# Privy integration

Althea uses Privy as the Relief Fund treasury control layer.

## Product boundary

Privy is not used for hospital FAP navigation.

## Implementation

- Client: `@privy-io/react-auth`
- Server: `@privy-io/node`
- Policy: allowlist `to` = Arc USDC and Althea ReliefPool; chain id `5042002`
- Financial flow: `wallets().ethereum().sendTransaction` approve + `deposit`

## Admin

`/admin/treasury`

- Fund Relief Pool
- Test Restricted Transfer → `Blocked by Althea Treasury Policy`

## Failure copy

```text
Treasury authorization could not be completed.
No funds moved.
```

## Credentials (Justin)

`NEXT_PUBLIC_PRIVY_APP_ID`, `PRIVY_APP_SECRET`, `PRIVY_TREASURY_WALLET_ID`, `PRIVY_POLICY_ID`

Do not fake a successful treasury transfer.
