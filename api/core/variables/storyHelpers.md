# Variable: storyHelpers

> `const` **storyHelpers**: [`StoryHelpers`](../type-aliases/StoryHelpers.md)

Defined in: [packages/core/src/passages/story/helpers.ts:185](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/passages/story/helpers.ts#L185)

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
