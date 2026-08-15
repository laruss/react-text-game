# Function: useImportSaves()

> **useImportSaves**(): (`file?`, `options?`) => `Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

Defined in: [packages/core/src/saves/hooks/useImportSaves.ts:38](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/hooks/useImportSaves.ts#L38)

React hook that imports game saves from an encrypted file: opens a file
picker, decodes the selection and writes what it holds.

## Returns

Callback that imports saves and reports how many landed

> (`file?`, `options?`): `Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

### Parameters

#### file?

`File`

#### options?

##### mode?

[`WriteSavesMode`](../type-aliases/WriteSavesMode.md)

### Returns

`Promise`\<[`WriteSavesResult`](../type-aliases/WriteSavesResult.md)\>

## Remarks

A convenience wrapper over `useReadSaveFile` and `useWriteSaves`. Reach for
those two directly when the flow needs to confirm the import with the file
already chosen - this hook cannot show the player what they are about to
replace, because it picks and writes in one call.

Nothing is deleted until the whole file has decoded and validated, and the
timestamps in the file are preserved.

## Example

```tsx
const importSaves = useImportSaves();
const handleImport = async () => {
  const result = await importSaves();
  if (result.success) {
    console.log(`Successfully imported ${result.count} saves`);
  } else if (result.code !== 'cancelled') {
    console.error('Import failed:', result.error);
  }
};
```
