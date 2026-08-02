# Type Alias: Options

> **Options** = `object`

Defined in: [packages/core/src/options.ts:6](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L6)

## Properties

### author

> **author**: `string`

Defined in: [packages/core/src/options.ts:39](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L39)

***

### description

> **description**: `string`

Defined in: [packages/core/src/options.ts:9](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L9)

***

### gameId

> **gameId**: `string`

Defined in: [packages/core/src/options.ts:8](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L8)

***

### gameName

> **gameName**: `string`

Defined in: [packages/core/src/options.ts:7](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L7)

***

### gameVersion

> **gameVersion**: `string`

Defined in: [packages/core/src/options.ts:10](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L10)

***

### initialState

> **initialState**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/options.ts:38](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L38)

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

Defined in: [packages/core/src/options.ts:40](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L40)

***

### startPassage

> **startPassage**: `string`

Defined in: [packages/core/src/options.ts:18](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L18)

Id of the passage the game opens on.

#### Remarks

Always a string here: a passage instance passed to `Game.init()` is
resolved to its id before the options are stored.

***

### translations

> **translations**: `I18nConfig`

Defined in: [packages/core/src/options.ts:41](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/options.ts#L41)
