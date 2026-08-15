# Function: createSeenStore()

> **createSeenStore**(`transport`): [`SeenStore`](../type-aliases/SeenStore.md)

Defined in: [seen/seenStore.ts:46](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/messenger/src/seen/seenStore.ts#L46)

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
