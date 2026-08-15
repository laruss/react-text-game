# Variable: settingsSeenTransport

> `const` **settingsSeenTransport**: [`SeenTransport`](../type-aliases/SeenTransport.md)

Defined in: [seen/seenStore.ts:26](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/messenger/src/seen/seenStore.ts#L26)

Persists the seen record in the engine's settings table.

## Remarks

Deliberately outside the save snapshot: "has the player ever read this" has to
outlive a single save slot, which is what makes skip-already-read, galleries,
and unlocked-ending screens possible.
