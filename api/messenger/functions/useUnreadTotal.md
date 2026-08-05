# Function: useUnreadTotal()

> **useUnreadTotal**(`chats?`): `number`

Defined in: [hooks/useUnreadTotal.ts:20](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/hooks/useUnreadTotal.ts#L20)

Subscribes a component to the total number of unseen entries.

## Parameters

### chats?

[`Chat`](../classes/Chat.md)[]

Chats to count. Defaults to every defined chat.

## Returns

`number`

Total unseen entries, for a single app badge

## Example

```tsx
function MessengerBadge() {
  const unread = useUnreadTotal();
  return unread > 0 ? <span>{unread}</span> : null;
}
```
