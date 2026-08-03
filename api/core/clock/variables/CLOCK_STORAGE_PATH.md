# Variable: CLOCK\_STORAGE\_PATH

> `const` **CLOCK\_STORAGE\_PATH**: `"$._system.clock"`

Defined in: [constants.ts:13](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/core/src/clock/constants.ts#L13)

JSONPath the clock persists its state at.

## Remarks

Lives under the protected system path, so it travels with every save
snapshot without colliding with entity ids.
