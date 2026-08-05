# Function: buildSchema()

> **buildSchema**(`__namedParameters`): [`SaveSchema`](../interfaces/SaveSchema.md)

Defined in: [schema.ts:100](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/devtools/src/schema.ts#L100)

Builds a comparable schema from one save state object.

Takes the version the state belongs to, the save state itself as
`Game.getState()` produces it, the registered passage ids (or `null` when the
source cannot know them), and where the state was captured from.

## Parameters

### \_\_namedParameters

#### capturedFrom

[`CaptureSource`](../type-aliases/CaptureSource.md)

#### gameData

`Record`\<`string`, `unknown`\>

#### gameVersion

`string`

#### passageIds

`string`[] \| `null`

## Returns

[`SaveSchema`](../interfaces/SaveSchema.md)

A schema ready to be written or diffed

## Example

```typescript
const schema = buildSchema({
    gameVersion: "0.1.0",
    gameData: { player: { health: 100 } },
    passageIds: ["intro"],
    capturedFrom: "code",
});
schema.paths; // { "player": "object", "player.health": "number" }
```
