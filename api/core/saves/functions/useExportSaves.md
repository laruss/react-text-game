# Function: useExportSaves()

> **useExportSaves**(): () => `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

Defined in: [packages/core/src/saves/hooks/useExportSaves.ts:27](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/saves/hooks/useExportSaves.ts#L27)

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
