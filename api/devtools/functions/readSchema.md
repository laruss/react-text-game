# Function: readSchema()

> **readSchema**(`filePath`): `Promise`\<[`SaveSchema`](../interfaces/SaveSchema.md)\>

Defined in: [store.ts:78](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/devtools/src/store.ts#L78)

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
