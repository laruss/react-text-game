# Function: useRestartGame()

> **useRestartGame**(): () => `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

Defined in: [packages/core/src/saves/hooks/useRestartGame.ts:19](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saves/hooks/useRestartGame.ts#L19)

React hook that provides a function to restart the game from the initial state.
Loads the system save (initial game state), clears auto-save, and navigates to start passage.

## Returns

Callback function that restarts the game

> (): `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

### Returns

`Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| \{ `error`: `null`; `success`: `boolean`; \}\>

## Example

```tsx
const restartGame = useRestartGame();
<button onClick={restartGame}>Restart Game</button>
```
