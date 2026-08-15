# Function: useExportSaves()

> **useExportSaves**(): () => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useExportSaves.ts:26](https://github.com/laruss/react-text-game/blob/d090054fc3e36a25c4143bb02c5270527e427321/packages/core/src/saves/hooks/useExportSaves.ts#L26)

React hook that provides a function to export all game saves to an encrypted file.
The exported file is downloaded with the game name, version, and .sx extension.

## Returns

Callback function that exports saves and returns a result object

> (): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Example

```tsx
const exportSaves = useExportSaves();
const handleExport = async () => {
  const result = await exportSaves();
  if (!result.success) {
    console.error('Export failed:', result.error);
  }
};
```
