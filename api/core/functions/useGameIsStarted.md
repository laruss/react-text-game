# Function: useGameIsStarted()

> **useGameIsStarted**(): `boolean`

Defined in: [packages/core/src/hooks/useGameIsStarted.ts:16](https://github.com/laruss/react-text-game/blob/a568b67a5a70142c4d99c081d8fed675aca313c3/packages/core/src/hooks/useGameIsStarted.ts#L16)

Determines whether the game has started.

## Returns

`boolean`

True if the game has started; false otherwise.

This function checks the current passage ID within the game's reactive state to infer
whether the game has progressed beyond the starting point. If the current passage ID
does not match the system-defined starting passage ID, the game is considered to have started.
