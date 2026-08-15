# Function: useUpdateSave()

> **useUpdateSave**(): (`slot`, `changes`) => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useUpdateSave.ts:28](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/saves/hooks/useUpdateSave.ts#L28)

React hook that provides a function to edit a save's label and metadata
without recapturing the game state.

## Returns

Function that accepts a slot and the fields to change

> (`slot`, `changes`): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Parameters

#### slot

`string` | `number`

#### changes

[`SaveUpdate`](../type-aliases/SaveUpdate.md)

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Remarks

The save's `timestamp` is left alone, so a renamed save keeps its place in a
list ordered by recency.

## Example

```tsx
const updateSave = useUpdateSave();
const handleRename = async (slot: number, title: string) => {
  const result = await updateSave(slot, { title });
  if (!result.success) {
    console.error('Rename failed:', result.error);
  }
};
```
