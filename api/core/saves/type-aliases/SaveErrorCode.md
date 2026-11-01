# Type Alias: SaveErrorCode

> **SaveErrorCode** = `"cancelled"` \| `"not-found"` \| `"bad-file"` \| `"decode-failed"` \| `"migration-failed"` \| `"storage-failed"`

Defined in: [packages/core/src/saves/types.ts:94](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/saves/types.ts#L94)

Machine-readable reason a save operation failed.

## Remarks

`cancelled` is not a failure the player needs to hear about: it means they
closed a file dialog. Hosts should stay silent on it.
