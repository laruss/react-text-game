# Function: createMemorySeenStore()

> **createMemorySeenStore**(): [`SeenStore`](../type-aliases/SeenStore.md)

Defined in: [seen/seenStore.ts:107](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/messenger/src/seen/seenStore.ts#L107)

Creates a seen store that never persists.

Useful for a game that has no use for cross-save tracking, and for tests.

## Returns

[`SeenStore`](../type-aliases/SeenStore.md)

## Example

```typescript
defineMessenger({ seenStore: createMemorySeenStore() });
```
