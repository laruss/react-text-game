# Function: findLatestSchema()

> **findLatestSchema**(`directory`): `Promise`\<\{ `path`: `string`; `schema`: [`SaveSchema`](../interfaces/SaveSchema.md); \} \| `null`\>

Defined in: [store.ts:119](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/devtools/src/store.ts#L119)

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
