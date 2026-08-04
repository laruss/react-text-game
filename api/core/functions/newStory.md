# Function: newStory()

> **newStory**(`id`, `content`, `options?`): [`Story`](../classes/Story.md)

Defined in: [packages/core/src/passages/story/fabric.ts:29](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/passages/story/fabric.ts#L29)

Creates a story passage from a props-first content callback.

## Parameters

### id

`string`

Unique identifier for the story

### content

[`StoryContent`](../type-aliases/StoryContent.md)

Function returning the story's components

### options?

[`StoryOptions`](../type-aliases/StoryOptions.md)

Optional background and styling configuration

## Returns

[`Story`](../classes/Story.md)

New Story instance, already registered with the Game

## Remarks

Fully supported and not scheduled for removal. New code is encouraged to use
[defineStory](defineStory.md) instead, which hands the content callback a toolbox of
component builders so component objects never have to be written by hand.

## Example

```typescript
newStory('intro', () => [
  { type: 'header', content: 'Chapter 1', props: { level: 1 } },
  { type: 'text', content: 'Your journey begins...' }
]);
```
