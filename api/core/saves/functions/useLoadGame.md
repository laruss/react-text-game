# Function: useLoadGame()

> **useLoadGame**(): (`id`) => `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

Defined in: [packages/core/src/saves/hooks/useLoadGame.ts:25](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/saves/hooks/useLoadGame.ts#L25)

React hook that provides a function to load a saved game by its ID.
Restores the game state from the specified save.

**Automatic Migration**: If the save version differs from the current game version,
registered migrations will be automatically applied to bring the save data up to date.

## Returns

Function that accepts an optional save ID and loads the game, returning a result object on failure

> (`id`): `Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

### Parameters

#### id

`number`

### Returns

`Promise`\<\{ `message`: `string`; `success`: `boolean`; \} \| `undefined`\>

## Example

```tsx
const loadGame = useLoadGame();
const handleLoad = async () => {
  const result = await loadGame(saveId);
  if (result?.success === false) {
    console.error('Load failed:', result.message);
  }
};
```
