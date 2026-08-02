# Function: defineStory()

> **defineStory**\<`TProps`\>(`id`, `content`, `options?`): [`Story`](../classes/Story.md)

Defined in: [packages/core/src/passages/story/fabric.ts:81](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/passages/story/fabric.ts#L81)

Creates a story passage from a helpers-first content callback.

The callback receives the [StoryHelpers](../type-aliases/StoryHelpers.md) toolbox as its first argument
and the display props as its second. Helpers return plain
[Component](../type-aliases/Component.md) objects, so helper calls and hand-written component
literals can be mixed in the same array, and falsy entries are dropped so
conditional content can be written inline.

## Type Parameters

### TProps

`TProps` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`EmptyObject`](../type-aliases/EmptyObject.md)

Type of props passed to `story.display()`

## Parameters

### id

`string`

Unique identifier for the story

### content

[`StoryContentFn`](../type-aliases/StoryContentFn.md)\<`TProps`\>

Function returning the story's components

### options?

[`StoryOptions`](../type-aliases/StoryOptions.md)

Optional background and styling configuration

## Returns

[`Story`](../classes/Story.md)

New Story instance, already registered with the Game

## Examples

```typescript
import { defineStory } from '@react-text-game/core';

defineStory('forest', (h) => [
  h.header('The Whispering Woods', { level: 1 }),
  h.image('/forest.webp', { alt: 'A mysterious forest path' }),
  h.text('The forest is ancient and alive.'),
  player.hasKey && h.text('The rusty key feels warm in your pocket.'),
  h.actions([
    { label: 'Go deeper', action: h.jump('forest-deep') },
    { label: 'Turn back', action: h.jump('village') }
  ])
], {
  background: { image: '/backgrounds/forest.webp' }
});
```

```typescript
// Typed props, resolved when display() is called explicitly
const greeting = defineStory<{ playerName: string }>(
  'greeting',
  (h, props) => [h.text(`Hello, ${props.playerName}!`)]
);

greeting.display({ playerName: 'Hero' });
```

## See

newStory - Previous props-first factory, still supported
