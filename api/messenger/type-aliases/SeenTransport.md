# Type Alias: SeenTransport

> **SeenTransport** = `object`

Defined in: [seen/seenStore.ts:13](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/seen/seenStore.ts#L13)

Where a [SeenStore](SeenStore.md) keeps its data.

Injectable so the default store can be tested without a database, and so a
game can persist the record somewhere else entirely.

## Methods

### read()

> **read**(): `Promise`\<`string`[]\>

Defined in: [seen/seenStore.ts:14](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/seen/seenStore.ts#L14)

#### Returns

`Promise`\<`string`[]\>

***

### write()

> **write**(`beatIds`): `Promise`\<`void`\>

Defined in: [seen/seenStore.ts:15](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/seen/seenStore.ts#L15)

#### Parameters

##### beatIds

`string`[]

#### Returns

`Promise`\<`void`\>
