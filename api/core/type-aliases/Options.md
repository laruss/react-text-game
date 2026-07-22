# Type Alias: Options

> **Options** = `object`

Defined in: [packages/core/src/options.ts:5](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L5)

## Properties

### author

> **author**: `string`

Defined in: [packages/core/src/options.ts:31](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L31)

***

### description

> **description**: `string`

Defined in: [packages/core/src/options.ts:8](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L8)

***

### gameId

> **gameId**: `string`

Defined in: [packages/core/src/options.ts:7](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L7)

***

### gameName

> **gameName**: `string`

Defined in: [packages/core/src/options.ts:6](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L6)

***

### gameVersion

> **gameVersion**: `string`

Defined in: [packages/core/src/options.ts:9](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L9)

***

### initialState

> **initialState**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/options.ts:30](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L30)

Initial state of the game entities.
Use this prop to override default entity values for debugging or testing.

Only supports game entity paths (e.g., { "player": { health: 50 } }).
System paths and unknown entities will be ignored.
Arrays will be replaced, not merged.

#### Example

```typescript
await Game.init({
  gameName: 'My Game',
  initialState: {
    player: { health: 50, name: 'TestPlayer' },
    inventory: { gold: 1000, items: ['sword', 'shield'] }
  }
});
```

***

### isDevMode

> **isDevMode**: `boolean`

Defined in: [packages/core/src/options.ts:32](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L32)

***

### startPassage

> **startPassage**: `string`

Defined in: [packages/core/src/options.ts:10](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L10)

***

### translations

> **translations**: `I18nConfig`

Defined in: [packages/core/src/options.ts:33](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/options.ts#L33)
