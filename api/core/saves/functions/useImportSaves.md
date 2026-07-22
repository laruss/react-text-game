# Function: useImportSaves()

> **useImportSaves**(): () => `Promise`\<\{ `count`: `number`; `error`: `string`; `success`: `boolean`; \} \| \{ `count`: `number`; `error`: `null`; `success`: `boolean`; \}\>

Defined in: [packages/core/src/saves/hooks/useImportSaves.ts:47](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/saves/hooks/useImportSaves.ts#L47)

React hook that provides a function to import game saves from an encrypted file.
Opens a file picker, decrypts the selected file, and replaces all existing saves.

## Returns

Callback function that imports saves and returns a result object with success status, count, and error

> (): `Promise`\<\{ `count`: `number`; `error`: `string`; `success`: `boolean`; \} \| \{ `count`: `number`; `error`: `null`; `success`: `boolean`; \}\>

### Returns

`Promise`\<\{ `count`: `number`; `error`: `string`; `success`: `boolean`; \} \| \{ `count`: `number`; `error`: `null`; `success`: `boolean`; \}\>

## Example

```tsx
const importSaves = useImportSaves();
const handleImport = async () => {
  const result = await importSaves();
  if (result.success) {
    console.log(`Successfully imported ${result.count} saves`);
  } else {
    console.error('Import failed:', result.error);
  }
};
```
