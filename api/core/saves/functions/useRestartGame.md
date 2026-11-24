# Function: useRestartGame()

> **useRestartGame**(): () => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

Defined in: [packages/core/src/saves/hooks/useRestartGame.ts:20](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/saves/hooks/useRestartGame.ts#L20)

React hook that provides a function to restart the game from the initial state.
Loads the system save (initial game state), clears auto-save, and navigates to start passage.

## Returns

Callback function that restarts the game

> (): `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Example

```tsx
const restartGame = useRestartGame();
<button onClick={restartGame}>Restart Game</button>
```
