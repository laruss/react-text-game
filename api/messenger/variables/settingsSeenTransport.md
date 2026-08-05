# Variable: settingsSeenTransport

> `const` **settingsSeenTransport**: [`SeenTransport`](../type-aliases/SeenTransport.md)

Defined in: [seen/seenStore.ts:26](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/messenger/src/seen/seenStore.ts#L26)

Persists the seen record in the engine's settings table.

## Remarks

Deliberately outside the save snapshot: "has the player ever read this" has to
outlive a single save slot, which is what makes skip-already-read, galleries,
and unlocked-ending screens possible.
