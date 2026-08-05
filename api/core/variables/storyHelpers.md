# Variable: storyHelpers

> `const` **storyHelpers**: [`StoryHelpers`](../type-aliases/StoryHelpers.md)

Defined in: [packages/core/src/passages/story/helpers.ts:185](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/core/src/passages/story/helpers.ts#L185)

Story component builders.

Normally received as the first argument of a [defineStory](../functions/defineStory.md) content
callback. Import it directly when a story is split across several files and
the helpers are needed outside of the callback body.

## Example

```typescript
import { defineStory, storyHelpers } from '@react-text-game/core';

const intro = () => [storyHelpers.header('The Whispering Woods')];

defineStory('forest', (h) => [...intro(), h.text('The forest is alive.')]);
```
