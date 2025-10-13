# Type Alias: SimpleObject()

> **SimpleObject** = \<`VariablesType`\>(`props`) => `SimpleObject`\<`VariablesType`\>

Defined in: [gameObjects/simpleObject.ts:96](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/core/src/gameObjects/simpleObject.ts#L96)

SimpleObject provides direct property access to game entity variables.

Instead of accessing `entity._variables.health`, you can use `entity.health` directly.
Supports nested objects with deep reactivity.

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
const player = new SimpleObject({
  id: 'player',
  variables: { health: 100, mana: 50 }
});

player.health = 75; // Direct access
player.health += 25; // Operators work
```
