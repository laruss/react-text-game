# Function: defineMessenger()

> **defineMessenger**(`options`): [`Messenger`](../type-aliases/Messenger.md)

Defined in: [messenger.ts:110](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/messenger/src/messenger.ts#L110)

Configures messenger-wide behaviour and returns the cross-chat facade.

## Parameters

### options

[`MessengerOptions`](../type-aliases/MessengerOptions.md) = `{}`

Store-wide callbacks, chat order, and the seen store

## Returns

[`Messenger`](../type-aliases/Messenger.md)

The messenger facade

## Remarks

Optional: chats work without it. Call it to register callbacks that should fire
for every chat, to fix the order of the chat list, or to swap the seen store.
Calling it again merges the new options over the old ones.

## Example

```typescript
import { defineMessenger } from '@react-text-game/messenger';

export const messenger = defineMessenger({
  chats: [annaChat, squad, news],
  onSend: ({ chat, entry }) => {
    if (entry.from !== 'player') incoming.play();
  },
});

await messenger.loadSeen();
```
