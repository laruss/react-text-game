# Interface: GameSettings

Defined in: [packages/core/src/saves/types.ts:123](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L123)

Represents a game setting stored in the database

## Properties

### id?

> `optional` **id**: `number`

Defined in: [packages/core/src/saves/types.ts:125](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L125)

Database auto-generated ID

***

### key

> **key**: `string`

Defined in: [packages/core/src/saves/types.ts:127](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L127)

Unique key for the setting

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/core/src/saves/types.ts:131](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L131)

When the setting was last updated

***

### value

> **value**: `string` \| `number` \| `boolean` \| `object`

Defined in: [packages/core/src/saves/types.ts:129](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L129)

Setting value (can be string, number, boolean, or object)

***

### version

> **version**: `string`

Defined in: [packages/core/src/saves/types.ts:133](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/types.ts#L133)

Game version when the setting was created/updated
