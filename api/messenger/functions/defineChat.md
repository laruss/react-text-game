# Function: defineChat()

> **defineChat**(`id`, `options`): [`Chat`](../classes/Chat.md)

Defined in: [chat.ts:1191](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/chat.ts#L1191)

Defines a chat.

## Parameters

### id

`string`

Unique, persistent identifier. It keys the transcript inside saves,
so treat it like a passage id and never rename it once a game has shipped.

### options

[`ChatOptions`](../type-aliases/ChatOptions.md) = `{}`

Peer or participants, title, avatar, read-only flag, callbacks

## Returns

[`Chat`](../classes/Chat.md)

The chat

## Throws

Error if the id is already taken

## Remarks

Defining a chat creates no state: the transcript is materialized the first time
something writes to it, which is also why adding a chat to a shipped game needs
no save migration. Reading a chat - including rendering it - creates nothing.

## Example

```typescript
import { defineChat, defineContact, m } from '@react-text-game/messenger';

const anna = defineContact('anna', { name: m.t('contacts.anna') });
const boris = defineContact('boris', { name: m.t('contacts.boris') });

// one-to-one
export const annaChat = defineChat('anna', { peer: anna });

// group with a title, a picture and members
export const squad = defineChat('squad', {
  title: m.t('chats.squad'),
  participants: [anna, boris],
  avatar: '/avatars/squad.webp',
});

// an announcement channel the player cannot answer
export const news = defineChat('news', {
  title: m.t('chats.news'),
  readOnly: true,
});
```
