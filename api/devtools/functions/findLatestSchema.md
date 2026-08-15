# Function: findLatestSchema()

> **findLatestSchema**(`directory`): `Promise`\<\{ `path`: `string`; `schema`: [`SaveSchema`](../interfaces/SaveSchema.md); \} \| `null`\>

Defined in: [store.ts:119](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/devtools/src/store.ts#L119)

Finds the highest-versioned snapshot in a directory.

## Parameters

### directory

`string`

Snapshot directory

## Returns

`Promise`\<\{ `path`: `string`; `schema`: [`SaveSchema`](../interfaces/SaveSchema.md); \} \| `null`\>

The snapshot and its path, or `null` when the directory holds none

## Throws

Error if a `.json` file in the directory is not a valid snapshot
