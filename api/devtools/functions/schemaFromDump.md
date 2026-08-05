# Function: schemaFromDump()

> **schemaFromDump**(`dump`, `gameVersion?`): [`SaveSchema`](../interfaces/SaveSchema.md)

Defined in: [artifacts.ts:140](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/artifacts.ts#L140)

Derives a schema from an IndexedDB record copied out of a browser.

Accepts any of:
- a whole `saves` table copy (an array of records)
- one record, such as the `__SYSTEM_INITIAL_STATE__` row
- a bare state object, in which case `gameVersion` is required

## Parameters

### dump

`unknown`

Parsed JSON from the browser

### gameVersion?

`string`

Required only for a bare state object or a mixed dump

## Returns

[`SaveSchema`](../interfaces/SaveSchema.md)

The derived schema

## Throws

Error if the dump holds no recognisable state
