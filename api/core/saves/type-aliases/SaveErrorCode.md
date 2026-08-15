# Type Alias: SaveErrorCode

> **SaveErrorCode** = `"cancelled"` \| `"not-found"` \| `"bad-file"` \| `"decode-failed"` \| `"migration-failed"` \| `"storage-failed"`

Defined in: [packages/core/src/saves/types.ts:94](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/types.ts#L94)

Machine-readable reason a save operation failed.

## Remarks

`cancelled` is not a failure the player needs to hear about: it means they
closed a file dialog. Hosts should stay silent on it.
