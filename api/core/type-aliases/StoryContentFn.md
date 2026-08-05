# Type Alias: StoryContentFn\<TProps\>

> **StoryContentFn**\<`TProps`\> = [`DefineFn`](DefineFn.md)\<[`StoryHelpers`](StoryHelpers.md), [`StoryContentItems`](StoryContentItems.md), `TProps`\>

Defined in: [packages/core/src/passages/story/types.ts:1017](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/story/types.ts#L1017)

Content callback accepted by `defineStory`.

Receives the [StoryHelpers](StoryHelpers.md) toolbox first and the display props
second.

## Type Parameters

### TProps

`TProps` *extends* [`InitVarsType`](InitVarsType.md) = [`EmptyObject`](EmptyObject.md)

Type of props passed to `story.display()`

## Remarks

Unlike [StoryContent](StoryContent.md), this is a generic *alias* rather than a generic
function type, so authors can annotate their props and have them checked:

```typescript
const content: StoryContentFn<{ playerName: string }> = (h, props) => [
  h.text(`Hello, ${props.playerName}!`)
];
```

## Example

```typescript
const content: StoryContentFn = (h) => [
  h.header('Welcome'),
  h.text('Your adventure begins...'),
  h.actions([{ content: 'Start', action: h.jump('chapter-1') }])
];
```
