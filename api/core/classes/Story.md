# Class: Story

Defined in: [packages/core/src/passages/story/story.ts:44](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/story/story.ts#L44)

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

Defined in: [packages/core/src/passages/story/story.ts:62](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/story/story.ts#L62)

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

### \_lastDisplayResult

> `protected` **\_lastDisplayResult**: `unknown` = `null`

Defined in: [packages/core/src/passages/passage.ts:47](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/passage.ts#L47)

**`Internal`**

Cached result from the last display() call.
Used to access display data without re-executing content functions.

#### Inherited from

[`Passage`](Passage.md).[`_lastDisplayResult`](Passage.md#_lastdisplayresult)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/core/src/passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

#### Inherited from

[`Passage`](Passage.md).[`id`](Passage.md#id)

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [packages/core/src/passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

#### Inherited from

[`Passage`](Passage.md).[`type`](Passage.md#type)

## Methods

### display()

> **display**\<`T`\>(`props`): `object`

Defined in: [packages/core/src/passages/story/story.ts:88](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/story/story.ts#L88)

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

***

### getLastDisplayResult()

> **getLastDisplayResult**\<`T`\>(): `T` \| `null`

Defined in: [packages/core/src/passages/passage.ts:96](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/passage.ts#L96)

Returns the cached result from the last display() call.
Use this method to access passage data without re-executing content functions,
which prevents unwanted side effects.

#### Type Parameters

##### T

`T` = `unknown`

Expected return type

#### Returns

`T` \| `null`

The cached display result, or null if display() has never been called

#### Example

```typescript
const story = newStory('test', () => [{ type: 'text', content: 'Hello' }]);

// First call to display() - executes content function
const result = story.display();

// Get cached result - does NOT execute content function again
const cached = story.getLastDisplayResult();
```

#### Inherited from

[`Passage`](Passage.md).[`getLastDisplayResult`](Passage.md#getlastdisplayresult)

***

### hasDisplayCache()

> **hasDisplayCache**(): `boolean`

Defined in: [packages/core/src/passages/passage.ts:105](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/passage.ts#L105)

Checks if a cached display result exists.

#### Returns

`boolean`

true if display() has been called at least once, false otherwise

#### Inherited from

[`Passage`](Passage.md).[`hasDisplayCache`](Passage.md#hasdisplaycache)
