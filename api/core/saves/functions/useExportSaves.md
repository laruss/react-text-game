# Function: useExportSaves()

> **useExportSaves**(): () => `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

Defined in: [packages/core/src/saves/hooks/useExportSaves.ts:27](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/hooks/useExportSaves.ts#L27)

React hook that provides a function to export all game saves to an encrypted file.
The exported file is downloaded with the game name, version, and .sx extension.

## Returns

Callback function that exports saves and returns a result object

> (): `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

### Returns

`Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

## Example

```tsx
const exportSaves = useExportSaves();
const handleExport = async () => {
  const result = await exportSaves();
  if (result.success) {
    console.log('Saves exported successfully');
  } else {
    console.error('Export failed:', result.error);
  }
};
```
