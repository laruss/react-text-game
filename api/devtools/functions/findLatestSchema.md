# Function: findLatestSchema()

> **findLatestSchema**(`directory`): `Promise`\<\{ `path`: `string`; `schema`: [`SaveSchema`](../interfaces/SaveSchema.md); \} \| `null`\>

Defined in: [store.ts:119](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/devtools/src/store.ts#L119)

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
