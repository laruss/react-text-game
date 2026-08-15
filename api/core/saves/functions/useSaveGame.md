# Function: useSaveGame()

> **useSaveGame**(): (`slot`, `options?`) => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useSaveGame.ts:28](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveGame.ts#L28)

React hook that provides a function to save the current game state to a specific slot.
The save is stored in IndexedDB with the slot number as its slot key.

## Returns

Function that accepts a slot number and optional annotations, and
saves the game

> (`slot`, `options?`): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Parameters

#### slot

`string` | `number`

#### options?

[`SaveOptions`](../type-aliases/SaveOptions.md)

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Example

```tsx
const saveGame = useSaveGame();
const handleSave = async () => {
  const result = await saveGame(1, {
    title: 'Before the boss',
    meta: { day: 3, place: 'flat' },
  });
  if (!result.success) {
    console.error('Save failed:', result.error);
  }
};
```
