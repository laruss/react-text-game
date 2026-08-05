# Function: useIsStoryMode()

> **useIsStoryMode**(): `boolean`

Defined in: [packages/core/src/hooks/useIsStoryMode.ts:12](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/hooks/useIsStoryMode.ts#L12)

Determines if the current passage is in "story" mode.

This function uses the `useCurrentPassage` hook to retrieve the current
passage and evaluates its type to check if it represents a "story."

## Returns

`boolean`

Returns `true` if the current passage type is "story", otherwise `false`.
