# Class: Clock

Defined in: [clock.ts:83](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L83)

The in-fiction clock of the game.

Game time is independent of wall-clock time: it starts at a fixed fictional
timestamp, persists with the save, and by default only moves when the game
says so. That makes it usable for schedules, cooldowns, day/night cycles, and
message timestamps without making saves or tests depend on when they ran.

State is stored as an anchor pair rather than a running counter, so
`"realtime"` mode needs no interval to stay correct across saves, page
reloads, and suspended tabs.

## Remarks

`advance()`, `set()`, `pause()`, `resume()`, `setMode()`, and `setScale()`
mutate game state, so call them from event handlers - never while a passage
renders.

## Example

```typescript
import { Clock, HOUR, MINUTE } from '@react-text-game/core/clock';

// Manual mode (default): time moves only when the game moves it.
Clock.advance(30 * MINUTE);
console.log(new Date(Clock.now()).toISOString());

// Realtime mode: one real second becomes one game minute.
Clock.setMode('realtime');
Clock.setScale(60);
```

## Constructors

### Constructor

> **new Clock**(): `Clock`

#### Returns

`Clock`

## Accessors

### isPaused

#### Get Signature

> **get** `static` **isPaused**(): `boolean`

Defined in: [clock.ts:121](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L121)

Whether `"realtime"` accrual is frozen.

##### Returns

`boolean`

***

### mode

#### Get Signature

> **get** `static` **mode**(): [`ClockMode`](../type-aliases/ClockMode.md)

Defined in: [clock.ts:107](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L107)

How game time currently advances.

##### Returns

[`ClockMode`](../type-aliases/ClockMode.md)

***

### scale

#### Get Signature

> **get** `static` **scale**(): `number`

Defined in: [clock.ts:114](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L114)

Multiplier applied to elapsed wall-clock time in `"realtime"` mode.

##### Returns

`number`

***

### selfState

#### Get Signature

> **get** `static` **selfState**(): [`ClockState`](../type-aliases/ClockState.md)

Defined in: [clock.ts:91](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L91)

Reactive clock state, for hooks that need to re-render on clock changes.

##### Remarks

Read game time through [Clock.now](#now) instead; this getter exists for
subscription, not for arithmetic.

##### Returns

[`ClockState`](../type-aliases/ClockState.md)

## Methods

### \_resetForTesting()

> `static` **\_resetForTesting**(): `void`

Defined in: [clock.ts:331](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L331)

**`Internal`**

Restores defaults and the real wall-clock source.

#### Returns

`void`

***

### \_setNowProvider()

> `static` **\_setNowProvider**(`provider`): `void`

Defined in: [clock.ts:322](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L322)

**`Internal`**

Replaces the wall-clock source. Tests only.

#### Parameters

##### provider

() => `number`

#### Returns

`void`

***

### advance()

> `static` **advance**(`ms`): `void`

Defined in: [clock.ts:141](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L141)

Moves game time forward by `ms`.

Works in both modes and regardless of [Clock.isPaused](#ispaused): an explicit
advance is always honoured. A negative value moves time backwards.

#### Parameters

##### ms

`number`

Milliseconds to add to the current game time

#### Returns

`void`

#### Throws

Error if `ms` is not finite

#### Example

```typescript
h.actions([
  { content: 'Sleep until morning', action: () => Clock.advance(8 * HOUR) },
]);
```

***

### init()

> `static` **init**(`options?`): `void`

Defined in: [clock.ts:251](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L251)

**`Internal`**

Applies clock options during `Game.init()`.

#### Parameters

##### options?

[`ClockOptions`](../type-aliases/ClockOptions.md)

#### Returns

`void`

***

### load()

> `static` **load**(): `void`

Defined in: [clock.ts:301](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L301)

**`Internal`**

Restores game time from storage, re-anchoring wall-clock time to now.

#### Returns

`void`

#### Remarks

Re-anchoring is what keeps real time that passed while the save sat on
disk out of game time. A save without clock data leaves the clock alone.

***

### now()

> `static` **now**(): `number`

Defined in: [clock.ts:100](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L100)

Current game time in milliseconds.

#### Returns

`number`

Game time, suitable for `new Date(...)`

***

### pause()

> `static` **pause**(): `void`

Defined in: [clock.ts:205](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L205)

Freezes `"realtime"` accrual, preserving the current game time.

#### Returns

`void`

#### Remarks

A no-op in `"manual"` mode beyond setting the flag, since manual time does
not flow on its own.

***

### resume()

> `static` **resume**(): `void`

Defined in: [clock.ts:220](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L220)

Resumes `"realtime"` accrual from the current game time.

#### Returns

`void`

***

### save()

> `static` **save**(): `void`

Defined in: [clock.ts:278](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L278)

**`Internal`**

Writes the resolved game time to storage.

#### Returns

`void`

***

### set()

> `static` **set**(`timestamp`): `void`

Defined in: [clock.ts:156](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L156)

Sets game time to an absolute timestamp.

#### Parameters

##### timestamp

`number`

Game time in milliseconds

#### Returns

`void`

#### Throws

Error if `timestamp` is not finite

***

### setMode()

> `static` **setMode**(`mode`): `void`

Defined in: [clock.ts:170](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L170)

Switches how game time advances, preserving the current game time.

#### Parameters

##### mode

[`ClockMode`](../type-aliases/ClockMode.md)

The new clock mode

#### Returns

`void`

***

### setScale()

> `static` **setScale**(`scale`): `void`

Defined in: [clock.ts:184](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L184)

Changes the `"realtime"` multiplier, preserving the current game time.

#### Parameters

##### scale

`number`

Multiplier applied to elapsed wall-clock time

#### Returns

`void`

#### Throws

Error if `scale` is not a finite positive number

***

### subscribe()

> `static` **subscribe**(`callback`): () => `void`

Defined in: [clock.ts:242](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/core/src/clock/clock.ts#L242)

Subscribes to clock state changes.

#### Parameters

##### callback

() => `void`

Invoked after every clock state change

#### Returns

Unsubscribe function

> (): `void`

##### Returns

`void`

#### Remarks

Fires when the clock is advanced, set, paused, resumed, or reconfigured -
not continuously as `"realtime"` time flows, because flowing time mutates
nothing. For a ticking display use `useGameTime(tickMs)`.
