# Function: useGameIsStarted()

> **useGameIsStarted**(): `boolean`

Defined in: [hooks/useGameIsStarted.ts:16](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/hooks/useGameIsStarted.ts#L16)

Determines whether the game has started.

## Returns

`boolean`

True if the game has started; false otherwise.

This function checks the current passage ID within the game's reactive state to infer
whether the game has progressed beyond the starting point. If the current passage ID
does not match the system-defined starting passage ID, the game is considered to have started.
