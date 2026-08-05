# Function: useChatList()

> **useChatList**(`chats?`): [`ChatListItem`](../type-aliases/ChatListItem.md)[]

Defined in: [hooks/useChatList.ts:41](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/hooks/useChatList.ts#L41)

Subscribes a component to every chat, most recently active first.

## Parameters

### chats?

[`Chat`](../classes/Chat.md)[]

Chats to list. Defaults to every defined chat.

## Returns

[`ChatListItem`](../type-aliases/ChatListItem.md)[]

A row per chat, recomputed whenever any chat changes

## Example

```tsx
function ChatList() {
  const rows = useChatList();

  return (
    <ul>
      {rows.map(({ chat, title, unread }) => (
        <li key={chat.id}>{title}{unread > 0 && ` (${unread})`}</li>
      ))}
    </ul>
  );
}
```
