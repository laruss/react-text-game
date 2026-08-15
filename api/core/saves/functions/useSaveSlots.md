# Function: useSaveSlots()

> **useSaveSlots**(`config`): [`SaveSlot`](../type-aliases/SaveSlot.md)[]

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:58](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useSaveSlots.ts#L58)

React hook that provides an array of save slots with live updates from IndexedDB.
Each slot includes the save data and methods to save, load, update and delete.

## Parameters

### config

Configuration object

#### count

`number`

Number of save slots to create (defaults to 1)

## Returns

[`SaveSlot`](../type-aliases/SaveSlot.md)[]

Array of save slot objects, each containing data and action methods

## Example

```tsx
const slots = useSaveSlots({ count: 5 });

return (
  <div>
    {slots.map((slot, index) => (
      <div key={index}>
        <p>Slot {index}: {slot.data?.title ?? 'Empty'}</p>
        <button onClick={() => slot.save({ title: 'Chapter 2' })}>Save</button>
        <button onClick={() => slot.load()} disabled={!slot.data}>Load</button>
        <button onClick={() => slot.update({ title: 'Renamed' })} disabled={!slot.data}>Rename</button>
        <button onClick={() => slot.delete()} disabled={!slot.data}>Delete</button>
      </div>
    ))}
  </div>
);
```
