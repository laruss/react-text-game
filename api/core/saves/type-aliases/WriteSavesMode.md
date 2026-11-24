# Type Alias: WriteSavesMode

> **WriteSavesMode** = `"replace"` \| `"merge"`

Defined in: [packages/core/src/saves/hooks/useWriteSaves.ts:14](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/saves/hooks/useWriteSaves.ts#L14)

How incoming saves meet the ones already on the device.

- `replace` - the player's other saves are cleared first. Restoring a backup.
- `merge` - only the slots being written are overwritten. Pulling one save
  off another machine.
