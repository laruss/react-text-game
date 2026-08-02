# Type Alias: NewOptions

> **NewOptions** = `Pick`\<[`Options`](Options.md), `"gameName"`\> & `Partial`\<`Omit`\<[`Options`](Options.md), `"gameName"` \| `"startPassage"`\>\> & `object`

Defined in: [packages/core/src/options.ts:44](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L44)

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
