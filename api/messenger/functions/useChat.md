# Function: useChat()

> **useChat**(`chat`): [`ChatSnapshot`](../type-aliases/ChatSnapshot.md)

Defined in: [hooks/useChat.ts:72](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/hooks/useChat.ts#L72)

Subscribes a component to one chat.

## Parameters

### chat

[`Chat`](../classes/Chat.md)

The chat to observe

## Returns

[`ChatSnapshot`](../type-aliases/ChatSnapshot.md)

A snapshot recomputed on every relevant change

## Remarks

Reads go through the store entity's reactive proxy, which tracks property
access - so a component watching one chat does not re-render when another chat
receives a message. Game time is observed too, so moving the clock expires
typing indicators. In `"realtime"` clock mode flowing time mutates nothing and
therefore triggers no re-render: drive the view with `useGameTime(tickMs)` or
a `deliverDueAll()` interval if indicators have to expire on their own.

Rendering never materializes state: a chat nothing has written to yet reports
its initial values.

## Example

```tsx
function ChatView({ chat }: { chat: Chat }) {
  const { entries, unread, pendingChoice, canReply } = useChat(chat);

  return (
    <>
      <ul>{entries.map((entry) => <li key={entry.key}>{entry.from}</li>)}</ul>
      {canReply && pendingChoice?.options.map((option) => (
        <button key={option.index} type="button" onClick={() => chat.choose(option.index)}>
          {option.content}
        </button>
      ))}
    </>
  );
}
```
