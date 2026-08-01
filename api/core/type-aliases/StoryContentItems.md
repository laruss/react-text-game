# Type Alias: StoryContentItems

> **StoryContentItems** = [`Conditional`](Conditional.md)\<[`Component`](Component.md)\>[]

Defined in: [packages/core/src/passages/story/types.ts:962](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/story/types.ts#L962)

Array returned by a [StoryContentFn](StoryContentFn.md).

Accepts `false`, `null` and `undefined` entries, which are removed before
the story is rendered. That makes conditional content expressible inline
instead of through a callback that returns `undefined`.

## Example

```typescript
const items: StoryContentItems = [
  { type: 'text', content: 'A locked door blocks your way.' },
  player.hasKey && { type: 'text', content: 'Your key fits the lock.' }
];
```
