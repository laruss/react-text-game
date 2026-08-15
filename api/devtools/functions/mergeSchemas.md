# Function: mergeSchemas()

> **mergeSchemas**(`schemas`): [`SaveSchema`](../interfaces/SaveSchema.md)

Defined in: [schema.ts:139](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/devtools/src/schema.ts#L139)

Merges schemas captured from several saves of the same game version.

## Parameters

### schemas

[`SaveSchema`](../interfaces/SaveSchema.md)[]

One or more schemas for the same version

## Returns

[`SaveSchema`](../interfaces/SaveSchema.md)

The merged schema

## Remarks

Exported save files hold one record per slot. Different slots populate
different collections, so the union of their paths describes the version
better than any single slot does. A concrete element kind always beats
`array<unknown>`, which only means "this slot happened to be empty here".

## Throws

Error if `schemas` is empty
