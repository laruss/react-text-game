# Function: defineScript()

> **defineScript**(`id`, `build`): [`Script`](../type-aliases/Script.md)

Defined in: [scripts/define.ts:43](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/scripts/define.ts#L43)

Defines an addressable sequence of beats for a chat.

## Parameters

### id

`string`

Unique, persistent identifier. It ends up inside saved transcripts,
so treat it like a passage id and never rename it once a game has shipped.

### build

[`ScriptBuilder`](../type-aliases/ScriptBuilder.md)

Callback returning the beats, given the [m](../variables/m.md) toolbox

## Returns

[`Script`](../type-aliases/Script.md)

The script, ready to hand to `chat.play()`

## Throws

Error if the id is already taken

## Remarks

The callback runs whenever the engine needs the beats - when the cursor
advances and when a text reference is resolved - so read game state freely but
never mutate it there. Falsy entries are skipped, and the position a beat is
written at determines its default id, so a conditional beat never shifts the
ids of the beats after it.

## Example

```typescript
import { defineScript } from '@react-text-game/messenger';

export const opener = defineScript('anna/opener', (m) => [
  m.from(anna).text(m.t('anna.opener.1')),
  m.typing(anna, 1200),
  m.from(anna).media([m.image('/park.webp')], { caption: m.t('anna.park') }),
  player.knowsBoris && m.from(anna).text(m.t('anna.aboutBoris')),
  m.wait(30 * MINUTE),
  m.choice('anna/opener/reply', [
    { content: m.t('reply.yes'), next: acceptBranch },
    { content: m.t('reply.no') },
  ]),
]);
```
