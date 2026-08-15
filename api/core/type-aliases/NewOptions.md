# Type Alias: NewOptions

> **NewOptions** = `Pick`\<[`Options`](Options.md), `"gameName"`\> & `Partial`\<`Omit`\<[`Options`](Options.md), `"gameName"` \| `"startPassage"`\>\> & `object`

Defined in: [packages/core/src/options.ts:63](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/options.ts#L63)

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
