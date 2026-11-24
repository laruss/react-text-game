# Type Alias: Severity

> **Severity** = `"error"` \| `"warning"` \| `"info"`

Defined in: [types.ts:76](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/devtools/src/types.ts#L76)

How much attention a difference deserves.

- `error` - old saves break or lose data without a migration
- `warning` - a human has to decide; usually a suspected rename
- `info` - harmless, recorded so the diff is complete
