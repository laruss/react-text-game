# Type Alias: SaveSlot

> **SaveSlot** = `object`

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:18](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L18)

One slot of a save browser: the save it holds, if any, plus the actions that
act on that slot.

## Properties

### data

> **data**: [`GameSave`](../interfaces/GameSave.md) \| `null`

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:20](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L20)

The save occupying this slot, or `null` when it is empty

***

### delete()

> **delete**: () => `Promise`\<[`SaveResult`](SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:26](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L26)

Empty this slot

#### Returns

`Promise`\<[`SaveResult`](SaveResult.md)\>

***

### load()

> **load**: () => `Promise`\<[`SaveResult`](SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:24](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L24)

Restore the run this slot holds

#### Returns

`Promise`\<[`SaveResult`](SaveResult.md)\>

***

### save()

> **save**: (`options?`) => `Promise`\<[`SaveResult`](SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:22](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L22)

Capture the current run into this slot

#### Parameters

##### options?

[`SaveOptions`](SaveOptions.md)

#### Returns

`Promise`\<[`SaveResult`](SaveResult.md)\>

***

### update()

> **update**: (`changes`) => `Promise`\<[`SaveResult`](SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useSaveSlots.ts:28](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/hooks/useSaveSlots.ts#L28)

Edit the label or metadata without recapturing state or moving the timestamp

#### Parameters

##### changes

[`SaveUpdate`](SaveUpdate.md)

#### Returns

`Promise`\<[`SaveResult`](SaveResult.md)\>
