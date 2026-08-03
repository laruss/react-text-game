# Type Alias: NewOptions

> **NewOptions** = `Pick`\<[`Options`](Options.md), `"gameName"`\> & `Partial`\<`Omit`\<[`Options`](Options.md), `"gameName"` \| `"startPassage"`\>\> & `object`

Defined in: [packages/core/src/options.ts:44](https://github.com/laruss/react-text-game/blob/244de4160e09d8c345e60cd6f5b8a8a3c66be8a9/packages/core/src/options.ts#L44)

## Type Declaration

### startPassage?

> `optional` **startPassage**: [`PassageTarget`](PassageTarget.md)

The passage the game opens on.

Accepts a passage instance (`Story`, `InteractiveMap`, `Widget`, or
any other `Passage`) or the id of a registered passage. The passage
may register after `Game.init()`; navigation waits for it.

#### Example

```typescript
import { intro } from './game/stories/intro';

await Game.init({ gameName: 'My Game', startPassage: intro });
await Game.init({ gameName: 'My Game', startPassage: 'intro' });
```
