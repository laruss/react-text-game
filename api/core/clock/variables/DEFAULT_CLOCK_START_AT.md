# Variable: DEFAULT\_CLOCK\_START\_AT

> `const` **DEFAULT\_CLOCK\_START\_AT**: `number`

Defined in: [constants.ts:35](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/clock/constants.ts#L35)

Game time a fresh game starts at: 2000-01-01, 09:00 UTC.

## Remarks

Deliberately a fixed timestamp rather than `Date.now()`. A wall-clock default
would make every test, replay, and screenshot depend on when it ran.
