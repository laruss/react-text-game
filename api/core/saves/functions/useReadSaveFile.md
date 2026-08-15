# Function: useReadSaveFile()

> **useReadSaveFile**(): (`file?`) => `Promise`\<[`ReadSaveFileResult`](../type-aliases/ReadSaveFileResult.md)\>

Defined in: [packages/core/src/saves/hooks/useReadSaveFile.ts:73](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useReadSaveFile.ts#L73)

React hook that decodes an exported save file into save records, without
writing anything.

## Returns

Callback that reads a save file and returns the records it holds

> (`file?`): `Promise`\<[`ReadSaveFileResult`](../type-aliases/ReadSaveFileResult.md)\>

### Parameters

#### file?

`File`

### Returns

`Promise`\<[`ReadSaveFileResult`](../type-aliases/ReadSaveFileResult.md)\>

## Remarks

Split out of `useImportSaves` so a host can confirm a destructive import
with the file already chosen and its contents known - and so the flow can be
tested without a real file chooser. Pass a `File` to skip the picker
entirely.

## Example

```tsx
const readSaveFile = useReadSaveFile();
const writeSaves = useWriteSaves();

const handleImport = async () => {
  const read = await readSaveFile();
  if (!read.success) {
    if (read.code !== 'cancelled') console.error(read.error);
    return;
  }
  if (!confirm(`Replace every save on this device with ${read.saves.length}?`)) return;
  await writeSaves(read.saves);
};
```
