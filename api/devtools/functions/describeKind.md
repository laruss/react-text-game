# Function: describeKind()

> **describeKind**(`value`): `string`

Defined in: [schema.ts:27](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/devtools/src/schema.ts#L27)

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
