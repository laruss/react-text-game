# Type Alias: CaptureSource

> **CaptureSource** = `"code"` \| `"save"` \| `"dump"`

Defined in: [types.ts:42](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/devtools/src/types.ts#L42)

Where a snapshot was captured from.

- `code` - by importing the game's modules (the richest source: it also knows
  the registered passage ids)
- `save` - from an exported `.sx` save file
- `dump` - from an IndexedDB record copied out of a browser
