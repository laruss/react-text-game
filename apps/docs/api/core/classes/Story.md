# Class: Story

Defined in: [passages/story/story.ts:44](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/story.ts#L44)

Text-based narrative passage for displaying story content with rich components.

Story passages support various component types including text, headers, images,
videos, actions, conversations, and embedded stories. Content is defined via
a function that receives props and returns an array of components.

## Example

```typescript
import { newStory } from '@react-text-game/core';

const introStory = newStory('intro', (props) => [
  {
    type: 'header',
    content: 'Chapter 1',
    props: { level: 1 }
  },
  {
    type: 'text',
    content: 'Your journey begins...'
  },
  {
    type: 'actions',
    content: [
      {
        label: 'Continue',
        action: () => Game.jumpTo('chapter-1')
      }
    ]
  }
], {
  background: { image: '/bg.jpg' },
  classNames: { container: 'story-container' }
});
```

## See

newStory - Factory function for creating Story instances

## Extends

- [`Passage`](Passage.md)

## Constructors

### Constructor

> **new Story**(`id`, `content`, `options`): `Story`

Defined in: [passages/story/story.ts:62](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/story.ts#L62)

Creates a new Story passage.

#### Parameters

##### id

`string`

Unique identifier for this story

##### content

[`StoryContent`](../type-aliases/StoryContent.md)

Function that returns an array of story components

##### options

[`StoryOptions`](../type-aliases/StoryOptions.md) = `{}`

Optional configuration for background, styling, etc.

#### Returns

`Story`

#### Overrides

[`Passage`](Passage.md).[`constructor`](Passage.md#constructor)

## Properties

### id

> `readonly` **id**: `string`

Defined in: [passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**\<`T`\>(`props`): `object`

Defined in: [passages/story/story.ts:88](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/story.ts#L88)

Renders the story by invoking the content function with props.

The content function receives props and returns an array of components
(text, headers, images, actions, etc.) that make up the story.

#### Type Parameters

##### T

`T` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`EmptyObject`](../type-aliases/EmptyObject.md)

Type of props to pass to the content function

#### Parameters

##### props

`T` = `...`

Properties used during rendering (e.g., player state, game flags)

#### Returns

`object`

Object containing story options and rendered components

##### components

> **components**: [`Component`](../type-aliases/Component.md)[]

##### options?

> `optional` **options**: [`StoryOptions`](../type-aliases/StoryOptions.md)

#### Example

```typescript
const story = newStory('test', () => [
  { type: 'text', content: 'Hello' }
]);

const { components, options } = story.display();
// components: [{ type: 'text', content: 'Hello' }]
```

#### Overrides

[`Passage`](Passage.md).[`display`](Passage.md#display)
