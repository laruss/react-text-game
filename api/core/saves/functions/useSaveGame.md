# Function: useSaveGame()

> **useSaveGame**(): (`id`) => `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

Defined in: [packages/core/src/saves/hooks/useSaveGame.ts:21](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/saves/hooks/useSaveGame.ts#L21)

React hook that provides a function to save the current game state to a specific slot.
The save is stored in IndexedDB with the slot number as the save name.

## Returns

Function that accepts a slot number and saves the game, returning a result object on failure

> (`id`): `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

### Parameters

#### id

`number`

### Returns

`Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

## Example

```tsx
const saveGame = useSaveGame();
const handleSave = async () => {
  const result = await saveGame(1);
  if (result?.success === false) {
    console.error('Save failed:', result.message);
  }
};
```
