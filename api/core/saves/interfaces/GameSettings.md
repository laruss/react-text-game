# Interface: GameSettings

Defined in: [packages/core/src/saves/types.ts:26](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L26)

Represents a game setting stored in the database

## Properties

### id?

> `optional` **id**: `number`

Defined in: [packages/core/src/saves/types.ts:28](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L28)

Database auto-generated ID

***

### key

> **key**: `string`

Defined in: [packages/core/src/saves/types.ts:30](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L30)

Unique key for the setting

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/core/src/saves/types.ts:34](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L34)

When the setting was last updated

***

### value

> **value**: `string` \| `number` \| `boolean` \| `object`

Defined in: [packages/core/src/saves/types.ts:32](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L32)

Setting value (can be string, number, boolean, or object)

***

### version

> **version**: `string`

Defined in: [packages/core/src/saves/types.ts:36](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/types.ts#L36)

Game version when the setting was created/updated
