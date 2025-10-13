# Function: useGameIsStarted()

> **useGameIsStarted**(): `boolean`

Defined in: [hooks/useGameIsStarted.ts:16](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/core/src/hooks/useGameIsStarted.ts#L16)

Determines whether the game has started.

## Returns

`boolean`

True if the game has started; false otherwise.

This function checks the current passage ID within the game's reactive state to infer
whether the game has progressed beyond the starting point. If the current passage ID
does not match the system-defined starting passage ID, the game is considered to have started.
