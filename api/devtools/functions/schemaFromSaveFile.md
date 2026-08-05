# Function: schemaFromSaveFile()

> **schemaFromSaveFile**(`bytes`, `gameId`, `gameVersion?`): [`SaveSchema`](../interfaces/SaveSchema.md)

Defined in: [artifacts.ts:95](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/artifacts.ts#L95)

Derives a schema from an exported `.sx` save file.

## Parameters

### bytes

`Uint8Array`

Raw contents of the `.sx` file

### gameId

`string`

The game's `gameId`, which the file is encrypted with

### gameVersion?

`string`

Required only when the file mixes several versions

## Returns

[`SaveSchema`](../interfaces/SaveSchema.md)

The derived schema

## Remarks

Useful for recovering a baseline from a game that is already in production:
a real save is a faithful record of the shape its version wrote, and its
populated collections reveal element types that empty defaults hide.

## Throws

Error if the file cannot be decrypted or holds no usable save
