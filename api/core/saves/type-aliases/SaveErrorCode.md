# Type Alias: SaveErrorCode

> **SaveErrorCode** = `"cancelled"` \| `"not-found"` \| `"bad-file"` \| `"decode-failed"` \| `"migration-failed"` \| `"storage-failed"`

Defined in: [packages/core/src/saves/types.ts:94](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L94)

Machine-readable reason a save operation failed.

## Remarks

`cancelled` is not a failure the player needs to hear about: it means they
closed a file dialog. Hosts should stay silent on it.
