# Function: useIsStoryMode()

> **useIsStoryMode**(): `boolean`

Defined in: [packages/core/src/hooks/useIsStoryMode.ts:12](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/hooks/useIsStoryMode.ts#L12)

Determines if the current passage is in "story" mode.

This function uses the `useCurrentPassage` hook to retrieve the current
passage and evaluates its type to check if it represents a "story."

## Returns

`boolean`

Returns `true` if the current passage type is "story", otherwise `false`.
