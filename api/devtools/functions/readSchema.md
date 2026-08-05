# Function: readSchema()

> **readSchema**(`filePath`): `Promise`\<[`SaveSchema`](../interfaces/SaveSchema.md)\>

Defined in: [store.ts:78](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/store.ts#L78)

Reads and validates one snapshot file.

## Parameters

### filePath

`string`

Path to a snapshot JSON file

## Returns

`Promise`\<[`SaveSchema`](../interfaces/SaveSchema.md)\>

The parsed schema

## Throws

Error if the file is unreadable, is not JSON, or is not a snapshot
this tool understands
