# Function: getSaveSchemaSource()

> **getSaveSchemaSource**(): [`SaveSchemaSource`](../interfaces/SaveSchemaSource.md)

Defined in: [packages/core/src/saveSchema.ts:61](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/saveSchema.ts#L61)

Captures the current shape of this game's saves.

Intended for build-time tooling that detects whether a save migration is
needed - see `@react-text-game/devtools`.

## Returns

[`SaveSchemaSource`](../interfaces/SaveSchemaSource.md)

The current game version, state, and registered passage ids

## Remarks

Deliberately usable **without** `Game.init()`: initialization opens the
IndexedDB save database, which does not exist outside a browser. Import the
modules that declare your entities and passages, then call this.

Called on a freshly imported game this returns the pristine default state.
Called mid-game it returns the live state, which has the same shape but with
populated collections - useful when empty defaults hide the element type.

## Example

```typescript
// Entities and passages register as a side effect of importing them.
import "./game/registry";
import { getSaveSchemaSource } from "@react-text-game/core";

const source = getSaveSchemaSource();
console.log(source.gameVersion, Object.keys(source.gameData));
```
