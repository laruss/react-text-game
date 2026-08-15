# Variable: settingsSeenTransport

> `const` **settingsSeenTransport**: [`SeenTransport`](../type-aliases/SeenTransport.md)

Defined in: [seen/seenStore.ts:26](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/messenger/src/seen/seenStore.ts#L26)

Persists the seen record in the engine's settings table.

## Remarks

Deliberately outside the save snapshot: "has the player ever read this" has to
outlive a single save slot, which is what makes skip-already-read, galleries,
and unlocked-ending screens possible.
