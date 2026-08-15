# Function: useLastLoadGame()

> **useLastLoadGame**(): `object`

Defined in: [packages/core/src/saves/hooks/useLastLoadGame.ts:49](https://github.com/laruss/react-text-game/blob/4ac7aac37690a99d98e7617adadc0f09958a2135/packages/core/src/saves/hooks/useLastLoadGame.ts#L49)

A custom hook for managing the loading of the last saved game state.

This hook provides functionality to determine the availability of the last saved game, as well as to load and restore the game data from the saved state.
It uses reactive data fetching and caching mechanisms to seamlessly manage game state retrieval.

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

> **loadLastGame**: () => `Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

#### Returns

`Promise`\<[`SaveResult`](../type-aliases/SaveResult.md)\>

## Remarks

Loading goes through the same path as `useLoadGame`, so a save written by an
older build is migrated here too.

 useLastLoadGame

## Example

```tsx
const { hasLastSave, loadLastGame, isLoading } = useLastLoadGame();

if (isLoading) {
  return <div>Loading...</div>;
}

return (
  <button onClick={loadLastGame} disabled={!hasLastSave}>
    Continue Last Game
  </button>
);
```
