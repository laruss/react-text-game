# Variable: DEFAULT\_CLOCK\_START\_AT

> `const` **DEFAULT\_CLOCK\_START\_AT**: `number`

Defined in: [constants.ts:35](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/constants.ts#L35)

Game time a fresh game starts at: 2000-01-01, 09:00 UTC.

## Remarks

Deliberately a fixed timestamp rather than `Date.now()`. A wall-clock default
would make every test, replay, and screenshot depend on when it ran.
