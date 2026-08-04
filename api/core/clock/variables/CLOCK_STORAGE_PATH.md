# Variable: CLOCK\_STORAGE\_PATH

> `const` **CLOCK\_STORAGE\_PATH**: `"$._system.clock"`

Defined in: [constants.ts:13](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/core/src/clock/constants.ts#L13)

JSONPath the clock persists its state at.

## Remarks

Lives under the protected system path, so it travels with every save
snapshot without colliding with entity ids.
