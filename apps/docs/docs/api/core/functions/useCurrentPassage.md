# Function: useCurrentPassage()

> **useCurrentPassage**(): [`Passage`](../classes/Passage.md) \| `null`

Defined in: [hooks/useCurrentPassage.ts:13](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/core/src/hooks/useCurrentPassage.ts#L13)

Retrieves the current passage in the game based on the reactive game state.
If there is no current passage ID, the function returns null.

## Returns

[`Passage`](../classes/Passage.md) \| `null`

The current passage object, or null if no passage is active.
