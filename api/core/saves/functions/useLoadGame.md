# Function: useLoadGame()

> **useLoadGame**(): (`slot`) => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useLoadGame.ts:99](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/hooks/useLoadGame.ts#L99)

React hook that provides a function to load the save in a slot.
Restores the game state from the specified save.

**Automatic Migration**: If the save version differs from the current game version,
registered migrations will be automatically applied to bring the save data up to date.

## Returns

Function that accepts a slot and loads the game

> (`slot`): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Loads the save in a slot, applying migrations when it predates the current
game version.

### Parameters

#### slot

Slot to load, *not* the save's database id

`string` | `number`

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

The outcome of the load

### Remarks

Shared by useLoadGame and `useLastLoadGame` so that both paths into a
save run the same migrations.

## Example

```tsx
const loadGame = useLoadGame();
const handleLoad = async () => {
  const result = await loadGame(slotIndex);
  if (!result.success) {
    console.error('Load failed:', result.error);
  }
};
```
