# Variable: CLOCK\_STORAGE\_PATH

> `const` **CLOCK\_STORAGE\_PATH**: `"$._system.clock"`

Defined in: [constants.ts:13](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/core/src/clock/constants.ts#L13)

JSONPath the clock persists its state at.

## Remarks

Lives under the protected system path, so it travels with every save
snapshot without colliding with entity ids.
