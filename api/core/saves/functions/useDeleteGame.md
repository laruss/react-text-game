# Function: useDeleteGame()

> **useDeleteGame**(): (`id`) => `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

Defined in: [packages/core/src/saves/hooks/useDeleteGame.ts:21](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/saves/hooks/useDeleteGame.ts#L21)

React hook that provides a function to delete a saved game by its ID.
Removes the save from IndexedDB storage.

## Returns

Function that accepts a save ID and deletes the game, returning a result object on failure

> (`id`): `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

### Parameters

#### id

`number`

### Returns

`Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

## Example

```tsx
const deleteGame = useDeleteGame();
const handleDelete = async () => {
  const result = await deleteGame(saveId);
  if (result?.success === false) {
    console.error('Delete failed:', result.message);
  }
};
```
