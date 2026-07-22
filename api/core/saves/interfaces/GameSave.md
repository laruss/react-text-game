# Interface: GameSave

Defined in: [packages/core/src/saves/types.ts:4](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L4)

Represents a saved game state

## Properties

### description?

> `optional` **description**: `string`

Defined in: [packages/core/src/saves/types.ts:18](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L18)

User-provided description (optional)

***

### gameData

> **gameData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/saves/types.ts:10](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L10)

Serialized game state data

***

### id?

> `optional` **id**: `number`

Defined in: [packages/core/src/saves/types.ts:6](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L6)

Database auto-generated ID

***

### isSystemSave?

> `optional` **isSystemSave**: `boolean`

Defined in: [packages/core/src/saves/types.ts:20](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L20)

Mark as system save (won't be shown in UI)

***

### name

> **name**: `string`

Defined in: [packages/core/src/saves/types.ts:8](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L8)

User-defined name for the save

***

### screenshot?

> `optional` **screenshot**: `string`

Defined in: [packages/core/src/saves/types.ts:16](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L16)

Base64 encoded screenshot (optional)

***

### timestamp

> **timestamp**: `Date`

Defined in: [packages/core/src/saves/types.ts:12](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L12)

When the save was created

***

### version

> **version**: `string`

Defined in: [packages/core/src/saves/types.ts:14](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/types.ts#L14)

Game version when the save was created
