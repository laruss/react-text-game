# Type Alias: Conditional\<T\>

> **Conditional**\<`T`\> = `T` \| `false` \| `null` \| `undefined`

Defined in: [packages/core/src/passages/definition.ts:45](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/definition.ts#L45)

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
  player.hasKey && h.actions([{ label: 'Unlock', action: h.jump('hall') }])
]);
```
