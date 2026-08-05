# Function: resolveText()

> **resolveText**(`text`): `ReactNode`

Defined in: [resolve.ts:31](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/resolve.ts#L31)

Resolves persisted text to something renderable.

A frozen string comes back as-is, a translation key is translated in the
current language, and a script reference is re-read from its beat - which is
how a message can hold a React node without the node ever being serialized.

## Parameters

### text

[`RichText`](../type-aliases/RichText.md)

Persisted text from a transcript entry

## Returns

`ReactNode`

The renderable content, or an empty string when a reference no longer
resolves

## Example

```typescript
const entry = chat.entries.at(-1);
if (entry?.payload.kind === "text") {
  render(resolveText(entry.payload.text));
}
```
