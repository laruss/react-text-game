# Function: useWriteSaves()

> **useWriteSaves**(): (`saves`, `options?`) => `Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

Defined in: [packages/core/src/saves/hooks/useWriteSaves.ts:38](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useWriteSaves.ts#L38)

React hook that writes whole save records into the database.

## Returns

Callback that writes save records and reports how many landed

> (`saves`, `options?`): `Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

### Parameters

#### saves

[`GameSave`](../interfaces/GameSave.md)[]

#### options?

##### mode?

[`WriteSavesMode`](../type-aliases/WriteSavesMode.md)

### Returns

`Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

## Remarks

Records keep the timestamp and version they carry, so saves restored from a
file stay in the order the player knew them by. In `replace` mode the wipe
and the writes share a transaction: nothing is destroyed unless the whole
write succeeds.

## Example

```tsx
const writeSaves = useWriteSaves();
await writeSaves(saves, { mode: 'merge' });
```
