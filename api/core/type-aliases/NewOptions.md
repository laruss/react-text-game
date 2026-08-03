# Type Alias: NewOptions

> **NewOptions** = `Pick`\<[`Options`](Options.md), `"gameName"`\> & `Partial`\<`Omit`\<[`Options`](Options.md), `"gameName"` \| `"startPassage"`\>\> & `object`

Defined in: [packages/core/src/options.ts:63](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/core/src/options.ts#L63)

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
