# Function: useCurrentPassage()

> **useCurrentPassage**(): `null` \| [`Passage`](../classes/Passage.md)

Defined in: [hooks/useCurrentPassage.ts:13](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/hooks/useCurrentPassage.ts#L13)

Retrieves the current passage in the game based on the reactive game state.
If there is no current passage ID, the function returns null.

## Returns

`null` \| [`Passage`](../classes/Passage.md)

The current passage object, or null if no passage is active.
