# Type Alias: ClockOptions

> **ClockOptions** = `object`

Defined in: [types.ts:26](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/types.ts#L26)

Configuration accepted by the `clock` option of `Game.init()`.

## Example

```typescript
await Game.init({
  gameName: 'My Game',
  clock: { startAt: Date.UTC(2031, 4, 12, 8, 30), mode: 'realtime', scale: 60 },
});
```

## Properties

### mode?

> `optional` **mode**: [`ClockMode`](ClockMode.md)

Defined in: [types.ts:41](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/types.ts#L41)

How game time advances.

#### Default Value

`"manual"`

***

### scale?

> `optional` **scale**: `number`

Defined in: [types.ts:49](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/types.ts#L49)

Multiplier applied to elapsed wall-clock time in `"realtime"` mode.
A scale of `60` turns one real second into one game minute.

#### Default Value

`1`

***

### startAt?

> `optional` **startAt**: `number`

Defined in: [types.ts:34](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/types.ts#L34)

Game time the clock starts at, in milliseconds.

#### Remarks

Defaults to a fixed fictional timestamp rather than `Date.now()`, so a
fresh game always starts at the same in-fiction moment.
