# Type Alias: PassageTarget

> **PassageTarget** = [`Passage`](../classes/Passage.md) \| `string`

Defined in: [packages/core/src/passages/passage.ts:132](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/core/src/passages/passage.ts#L132)

Anything the engine accepts as a navigation target.

Either a passage instance — a `Story`, an `InteractiveMap`, a `Widget`, or
any other [Passage](../classes/Passage.md) subclass — or the id of a registered passage.

## Remarks

Passing the instance is preferred: the id is read from the object, so a
renamed passage cannot silently become a dead link. Accepted by
`Game.jumpTo()`, `Game.setCurrent()`, the `startPassage` option and the
`jump()` helper.

## Example

```typescript
import { defineStory, Game } from '@react-text-game/core';

const chapter1 = defineStory('chapter-1', (h) => [h.text('...')]);

Game.jumpTo(chapter1);    // passage instance
Game.jumpTo('chapter-1'); // registered passage id
```
