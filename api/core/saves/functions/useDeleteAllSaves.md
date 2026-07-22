# Function: useDeleteAllSaves()

> **useDeleteAllSaves**(): () => `Promise`\<`void`\>

Defined in: [packages/core/src/saves/hooks/useDeleteAllSlots.ts:18](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/saves/hooks/useDeleteAllSlots.ts#L18)

React hook that provides a function to delete all game saves.
This function clears all saved game data from the database.

## Returns

Callback function that deletes all game saves

> (): `Promise`\<`void`\>

Deletes all game save data from the database.

This method clears all records within the "saves" table or collection,
resulting in the complete removal of stored game save data.

### Returns

`Promise`\<`void`\>

A promise that resolves when the game save data has been successfully deleted.

## Example

```tsx
const deleteAllSaves = useDeleteAllSaves();
const handleDeleteAll = async () => {
  await deleteAllSaves();
  console.log('All game saves have been deleted.');
};
```
