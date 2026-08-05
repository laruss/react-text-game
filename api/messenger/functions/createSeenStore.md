# Function: createSeenStore()

> **createSeenStore**(`transport`): [`SeenStore`](../type-aliases/SeenStore.md)

Defined in: [seen/seenStore.ts:46](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/seen/seenStore.ts#L46)

Creates the default cross-save seen store.

Reads are synchronous from an in-memory set; writes are debounced, because a
burst of delivered messages should not mean a burst of database writes.

## Parameters

### transport

[`SeenTransport`](../type-aliases/SeenTransport.md) = `settingsSeenTransport`

Where to persist the record. Defaults to the settings table.

## Returns

[`SeenStore`](../type-aliases/SeenStore.md)

## Example

```typescript
const messenger = defineMessenger();
await messenger.loadSeen();      // during bootstrap
await messenger.flushSeen();     // before the tab closes
```
