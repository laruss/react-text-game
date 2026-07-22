# Function: useIsStoryMode()

> **useIsStoryMode**(): `boolean`

Defined in: [packages/core/src/hooks/useIsStoryMode.ts:12](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/hooks/useIsStoryMode.ts#L12)

Determines if the current passage is in "story" mode.

This function uses the `useCurrentPassage` hook to retrieve the current
passage and evaluates its type to check if it represents a "story."

## Returns

`boolean`

Returns `true` if the current passage type is "story", otherwise `false`.
