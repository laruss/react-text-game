# Variable: SYSTEM\_SAVE\_NAME

> `const` **SYSTEM\_SAVE\_NAME**: `"__SYSTEM_INITIAL_STATE__"` = `"__SYSTEM_INITIAL_STATE__"`

Defined in: [artifacts.ts:15](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/artifacts.ts#L15)

Name the engine reserves for the pristine initial state it writes on every
`Game.init()`.

## Remarks

This record is the ideal baseline: it is the untouched default state of the
version that wrote it. A browser's IndexedDB holds one for whichever version
ran there last.
