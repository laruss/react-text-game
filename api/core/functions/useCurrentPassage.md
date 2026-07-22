# Function: useCurrentPassage()

> **useCurrentPassage**(): \[[`Passage`](../classes/Passage.md) \| `null`, `string` \| `null`\]

Defined in: [packages/core/src/hooks/useCurrentPassage.ts:18](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/hooks/useCurrentPassage.ts#L18)

Retrieves the current passage and render identifier from the game state.

This function accesses the reactive game state, retrieves the current passage
based on its identifier, and returns it along with the render ID. If no current
passage ID is present, the function returns `null` for the passage and the
render ID only.

## Returns

\[[`Passage`](../classes/Passage.md) \| `null`, `string` \| `null`\]

An array where the first element is the current passage
                                          or `null` if no passage ID exists, and the second element
                                          is the render ID or `null`.
