# Type Alias: CaptureSource

> **CaptureSource** = `"code"` \| `"save"` \| `"dump"`

Defined in: [types.ts:42](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/types.ts#L42)

Where a snapshot was captured from.

- `code` - by importing the game's modules (the richest source: it also knows
  the registered passage ids)
- `save` - from an exported `.sx` save file
- `dump` - from an IndexedDB record copied out of a browser
