# Function: diffSchemas()

> **diffSchemas**(`baseline`, `current`, `migrationPathExists`): [`CheckResult`](../interfaces/CheckResult.md)

Defined in: [diff.ts:113](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/devtools/src/diff.ts#L113)

Compares a baseline snapshot against the current save shape.

Classification follows the engine's actual load behaviour
(`BaseGameObject.load()`), not intuition:

- a **new field** on an existing entity keeps its default, because loading
  merges the save over the freshly constructed defaults - harmless
- a **new entity** the save knows nothing about has its variables *cleared*,
  not defaulted - it needs a migration
- a **renamed field** leaves the player's value stranded under the old name
- a **changed kind** hands the game a value of the wrong type
- a **removed passage** leaves `_system.game.currentPassageId` dangling, and
  the engine resolves it to `null` without complaining

## Parameters

### baseline

[`SaveSchema`](../interfaces/SaveSchema.md)

Schema of the released version

### current

[`SaveSchema`](../interfaces/SaveSchema.md)

Schema of the version under development

### migrationPathExists

Whether the game registers a migration chain from
the baseline version to the current one. Pass `null` when unknown, which is
the case for any capture that did not import the game's code.

`boolean` | `null`

## Returns

[`CheckResult`](../interfaces/CheckResult.md)

Findings plus whether a migration is required

## Example

```typescript
const result = diffSchemas(baseline, current);
if (result.migrationRequired) {
    console.error(result.findings);
}
```
