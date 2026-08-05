# Function: useIsStoryMode()

> **useIsStoryMode**(): `boolean`

Defined in: [packages/core/src/hooks/useIsStoryMode.ts:12](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/core/src/hooks/useIsStoryMode.ts#L12)

Determines if the current passage is in "story" mode.

This function uses the `useCurrentPassage` hook to retrieve the current
passage and evaluates its type to check if it represents a "story."

## Returns

`boolean`

Returns `true` if the current passage type is "story", otherwise `false`.
