# Type Alias: SimpleObject()

> **SimpleObject** = \<`VariablesType`\>(`props`) => `SimpleObject`\<`VariablesType`\>

Defined in: [packages/core/src/gameObjects/simpleObject.ts:99](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/gameObjects/simpleObject.ts#L99)

SimpleObject provides direct property access to game entity variables.

Instead of accessing `entity._variables.health`, you can use `entity.health` directly.
Supports nested objects with deep reactivity using Valtio proxies.

**IMPORTANT:** All properties in `variables` must be required (non-optional).
Optional properties are not supported because the Proxy-based implementation
cannot distinguish between undefined optional values and missing properties.

## Parameters

### props

#### id

`string`

#### variables?

`VariablesType`

## Returns

`SimpleObject`\<`VariablesType`\>

## Example

```typescript
// ✅ Correct - All properties are required
const player = new SimpleObject({
  id: 'player',
  variables: { health: 100, mana: 50 }
});

player.health = 75; // Direct access
player.health += 25; // Operators work

// ✅ Correct - Use explicit undefined for optional-like behavior
const player = new SimpleObject({
  id: 'player',
  variables: {
    health: 100,
    special: undefined as string | undefined // Explicit type
  }
});

// ❌ Wrong - Optional properties cause TypeScript errors
const player = new SimpleObject({
  id: 'player',
  variables: {
    health: 100,
    mana?: 50  // This will not compile
  }
});
```
