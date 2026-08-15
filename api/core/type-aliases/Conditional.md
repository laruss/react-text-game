# Type Alias: Conditional\<T\>

> **Conditional**\<`T`\> = `T` \| `false` \| `null` \| `undefined`

Defined in: [packages/core/src/passages/definition.ts:45](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/passages/definition.ts#L45)

A value that may be omitted from a helper array.

Falsy entries are removed before the passage is rendered, which lets
conditional content be written inline with `&&` instead of a callback that
returns `undefined`.

## Type Parameters

### T

`T`

## Example

```typescript
defineStory('room', (h) => [
  h.text('A locked door blocks your way.'),
  player.hasKey && h.actions([{ content: 'Unlock', action: h.jump('hall') }])
]);
```
