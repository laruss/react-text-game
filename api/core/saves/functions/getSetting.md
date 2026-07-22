# Function: getSetting()

> **getSetting**\<`T`\>(`key`, `defaultValue`): `Promise`\<`T`\>

Defined in: [packages/core/src/saves/db.ts:230](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/db.ts#L230)

Get a game setting

## Type Parameters

### T

`T`

## Parameters

### key

`string`

Setting key

### defaultValue

`T`

Default value if setting doesn't exist

## Returns

`Promise`\<`T`\>

Promise<T> - The setting value or default value
