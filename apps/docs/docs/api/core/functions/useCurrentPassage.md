# Function: useCurrentPassage()

> **useCurrentPassage**(): `null` \| [`Passage`](../classes/Passage.md)

Defined in: [hooks/useCurrentPassage.ts:13](https://github.com/laruss/react-text-game/blob/5d1b7f722e0508dc7727e83f20112624d7c139f7/packages/core/src/hooks/useCurrentPassage.ts#L13)

Retrieves the current passage in the game based on the reactive game state.
If there is no current passage ID, the function returns null.

## Returns

`null` \| [`Passage`](../classes/Passage.md)

The current passage object, or null if no passage is active.
