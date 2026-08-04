# Type Alias: SeenStore

> **SeenStore** = `object`

Defined in: [types.ts:272](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L272)

Cross-save record of which script beats the player has ever seen.

Backs "skip already-read text", galleries, and unlocked-ending screens, all of
which have to outlive a single save slot. The default implementation keeps an
in-memory set and persists it through the engine's settings table.

## Methods

### add()

> **add**(`beatId`): `void`

Defined in: [types.ts:277](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L277)

Records a beat as seen. Persisting may be debounced.

#### Parameters

##### beatId

`string`

#### Returns

`void`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [types.ts:283](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L283)

Forces any pending write to complete.

#### Returns

`Promise`\<`void`\>

***

### has()

> **has**(`beatId`): `boolean`

Defined in: [types.ts:274](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L274)

Whether a beat has ever been seen. Synchronous by design.

#### Parameters

##### beatId

`string`

#### Returns

`boolean`

***

### load()

> **load**(): `Promise`\<`void`\>

Defined in: [types.ts:280](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/types.ts#L280)

Loads persisted data. Call once during bootstrap.

#### Returns

`Promise`\<`void`\>
