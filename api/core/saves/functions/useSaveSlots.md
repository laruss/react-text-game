# Function: useSaveSlots()

> **useSaveSlots**(`config`): `object`[]

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:38](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/hooks/useSaveSlots.ts#L38)

React hook that provides an array of save slots with live updates from IndexedDB.
Each slot includes the save data and methods to save, load, and delete.

## Parameters

### config

Configuration object

#### count

`number`

Number of save slots to create (defaults to 1)

## Returns

`object`[]

Array of save slot objects, each containing data and action methods

## Example

```tsx
const slots = useSaveSlots({ count: 5 });

return (
  <div>
    {slots.map((slot, index) => (
      <div key={index}>
        <p>Slot {index}: {slot.data ? 'Saved' : 'Empty'}</p>
        <button onClick={() => slot.save()}>Save</button>
        <button onClick={() => slot.load()} disabled={!slot.data}>Load</button>
        <button onClick={() => slot.delete()} disabled={!slot.data}>Delete</button>
      </div>
    ))}
  </div>
);
```
