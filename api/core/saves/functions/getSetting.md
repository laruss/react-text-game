# Function: getSetting()

> **getSetting**\<`T`\>(`key`, `defaultValue`): `Promise`\<`T`\>

Defined in: [packages/core/src/saves/db.ts:374](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/db.ts#L374)

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
