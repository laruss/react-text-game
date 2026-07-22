# Function: useLastLoadGame()

> **useLastLoadGame**(): `object`

Defined in: [packages/core/src/saves/hooks/useLastLoadGame.ts:43](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/saves/hooks/useLastLoadGame.ts#L43)

A custom hook for managing the loading of the last saved game state.

This hook provides functionality to determine the availability of the last saved game, as well as to load and restore the game data from the saved state.
It uses reactive data fetching and caching mechanisms to seamlessly manage game state retrieval.

 useLastLoadGame

## Returns

`object`

Returns an object containing:
- `hasLastSave` {boolean}: Indicates whether a last saved game exists.
- `loadLastGame` {Function}: Asynchronous function to load the last saved game state.
- `isLoading` {boolean}: Represents whether the last save status is currently being determined.
- `lastSave` {Object|null}: The last saved game data object, or null if not available.

### hasLastSave

> **hasLastSave**: `boolean` = `!!lastSave`

### isLoading

> **isLoading**: `boolean`

### lastSave

> **lastSave**: [`GameSave`](../interfaces/GameSave.md) \| `null`

### loadLastGame()

> **loadLastGame**: () => `Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| `undefined`\>

#### Returns

`Promise`\<\{ `error`: `string`; `success`: `boolean`; \} \| `undefined`\>

## Example

```tsx
const { hasLastSave, loadLastGame, isLoading } = useGetLastLoadGame();

if (isLoading) {
  return <div>Loading...</div>;
}

return (
  <button onClick={loadLastGame} disabled={!hasLastSave}>
    Continue Last Game
  </button>
);
```
