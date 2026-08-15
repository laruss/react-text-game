# Variable: SYSTEM\_SAVE\_NAME

> `const` **SYSTEM\_SAVE\_NAME**: `"__SYSTEM_INITIAL_STATE__"` = `"__SYSTEM_INITIAL_STATE__"`

Defined in: [artifacts.ts:15](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/devtools/src/artifacts.ts#L15)

Name the engine reserves for the pristine initial state it writes on every
`Game.init()`.

## Remarks

This record is the ideal baseline: it is the untouched default state of the
version that wrote it. A browser's IndexedDB holds one for whichever version
ran there last.
