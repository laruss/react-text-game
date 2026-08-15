# Function: useDeleteAllSaves()

> **useDeleteAllSaves**(): () => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useDeleteAllSlots.ts:26](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useDeleteAllSlots.ts#L26)

React hook that provides a function to delete all game saves.
This function clears all saved game data from the database, keeping the
system save that `Game.init()` writes.

## Returns

Callback function that deletes all game saves

> (): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Example

```tsx
const deleteAllSaves = useDeleteAllSaves();
const handleDeleteAll = async () => {
  const result = await deleteAllSaves();
  if (!result.success) {
    console.error('Delete failed:', result.error);
  }
};
```
