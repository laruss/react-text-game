# Variable: CLOCK\_STORAGE\_PATH

> `const` **CLOCK\_STORAGE\_PATH**: `"$._system.clock"`

Defined in: [constants.ts:13](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/core/src/clock/constants.ts#L13)

JSONPath the clock persists its state at.

## Remarks

Lives under the protected system path, so it travels with every save
snapshot without colliding with entity ids.
