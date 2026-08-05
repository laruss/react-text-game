# Interface: SaveSchemaSource

Defined in: [packages/core/src/saveSchema.ts:14](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saveSchema.ts#L14)

Everything needed to describe the shape of this game's saves.

## Remarks

This is raw material, not a schema: it carries the actual state object and
the registered passage ids. Turning it into a comparable schema (recording
value *kinds* rather than values) is the job of the tooling that consumes it,
so the engine stays free of any particular schema format.

## Properties

### gameData

> **gameData**: [`GameSaveState`](../type-aliases/GameSaveState.md)

Defined in: [packages/core/src/saveSchema.ts:22](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saveSchema.ts#L22)

The state a save would contain right now, exactly as `Game.getState()`
would produce it - entity variables plus the `_system` paths owned by the
engine.

***

### gameVersion

> **gameVersion**: `string`

Defined in: [packages/core/src/saveSchema.ts:16](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saveSchema.ts#L16)

Version the game currently declares through `Game.init()`.

***

### passageIds

> **passageIds**: `string`[]

Defined in: [packages/core/src/saveSchema.ts:31](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saveSchema.ts#L31)

Ids of every registered passage, sorted.

#### Remarks

Needed because a save stores `_system.game.currentPassageId`. Deleting or
renaming a passage leaves old saves pointing at an id that no longer
resolves, which is not visible in the state shape alone.
