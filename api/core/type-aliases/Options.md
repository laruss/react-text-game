# Type Alias: Options

> **Options** = `object`

Defined in: [packages/core/src/options.ts:8](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L8)

## Properties

### author

> **author**: `string`

Defined in: [packages/core/src/options.ts:41](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L41)

***

### clock

> **clock**: `ClockOptions`

Defined in: [packages/core/src/options.ts:60](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L60)

Configuration for the in-fiction game clock.

#### Remarks

Defaults to a manual clock starting at a fixed fictional timestamp, so
game time never depends on when the game was played. Read the resolved
values through `Clock` from `@react-text-game/core/clock`.

#### Example

```typescript
await Game.init({
  gameName: 'My Game',
  clock: { startAt: Date.UTC(2031, 4, 12, 8, 30), mode: 'realtime', scale: 60 },
});
```

***

### description

> **description**: `string`

Defined in: [packages/core/src/options.ts:11](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L11)

***

### gameId

> **gameId**: `string`

Defined in: [packages/core/src/options.ts:10](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L10)

***

### gameName

> **gameName**: `string`

Defined in: [packages/core/src/options.ts:9](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L9)

***

### gameVersion

> **gameVersion**: `string`

Defined in: [packages/core/src/options.ts:12](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L12)

***

### initialState

> **initialState**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/options.ts:40](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L40)

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

Defined in: [packages/core/src/options.ts:42](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L42)

***

### startPassage

> **startPassage**: `string`

Defined in: [packages/core/src/options.ts:20](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L20)

Id of the passage the game opens on.

#### Remarks

Always a string here: a passage instance passed to `Game.init()` is
resolved to its id before the options are stored.

***

### translations

> **translations**: `I18nConfig`

Defined in: [packages/core/src/options.ts:43](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/options.ts#L43)
