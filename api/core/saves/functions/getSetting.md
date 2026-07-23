# Function: getSetting()

> **getSetting**\<`T`\>(`key`, `defaultValue`): `Promise`\<`T`\>

Defined in: [packages/core/src/saves/db.ts:230](https://github.com/laruss/react-text-game/blob/f7dda31ab988f053b8ffa41bcea26ca861ac96ab/packages/core/src/saves/db.ts#L230)

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
