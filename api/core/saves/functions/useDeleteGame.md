# Function: useDeleteGame()

> **useDeleteGame**(): (`slot`) => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useDeleteGame.ts:24](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useDeleteGame.ts#L24)

React hook that provides a function to delete the save in a slot.
Removes the save from IndexedDB storage.

## Returns

Function that accepts a slot and deletes the save it holds

> (`slot`): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Parameters

#### slot

`string` | `number`

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Example

```tsx
const deleteGame = useDeleteGame();
const handleDelete = async () => {
  const result = await deleteGame(slotIndex);
  if (!result.success) {
    console.error('Delete failed:', result.error);
  }
};
```
