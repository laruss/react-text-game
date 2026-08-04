# Function: describeKind()

> **describeKind**(`value`): `string`

Defined in: [schema.ts:27](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/schema.ts#L27)

Describes a value's kind without recording the value itself.

## Parameters

### value

`unknown`

Any value found in save state

## Returns

`string`

The kind string, e.g. `"number"`, `"object"`, `"array<string>"`

## Example

```typescript
describeKind(7);              // "number"
describeKind(null);           // "null"
describeKind([]);             // "array<unknown>"
describeKind(["a", "b"]);     // "array<string>"
describeKind([1, "a"]);       // "array<mixed>"
```
