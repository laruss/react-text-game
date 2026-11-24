# Variable: uiTranslations

> `const` **uiTranslations**: `object`

Defined in: [index.ts:13](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/ui/src/i18n/index.ts#L13)

This package's default strings, keyed by language and namespace.

## Type Declaration

### en

> `readonly` **en**: `object`

#### en.ui

> **ui**: `object`

English defaults for the `ui` namespace.

##### Remarks

A TypeScript module rather than JSON on purpose: Node's ESM resolver requires
an `with { type: "json" }` import attribute for JSON modules, so a bare JSON
import makes this entry unloadable under plain Node (SSR).

#### en.ui.mainMenu

> **mainMenu**: `object`

#### en.ui.mainMenu.continue

> **continue**: `string` = `"Continue"`

#### en.ui.mainMenu.loadGame

> **loadGame**: `string` = `"Load Game"`

#### en.ui.mainMenu.newGame

> **newGame**: `string` = `"New Game"`

#### en.ui.mainMenu.title

> **title**: `string` = `"Main Menu"`

#### en.ui.saves

> **saves**: `object`

#### en.ui.saves.actions

> **actions**: `object`

#### en.ui.saves.actions.close

> **close**: `string` = `"Close"`

#### en.ui.saves.actions.delete

> **delete**: `string` = `"Delete"`

#### en.ui.saves.actions.load

> **load**: `string` = `"Load"`

#### en.ui.saves.actions.loading

> **loading**: `string` = `"Loading..."`

#### en.ui.saves.actions.save

> **save**: `string` = `"Save"`

#### en.ui.saves.actions.saving

> **saving**: `string` = `"Saving..."`

#### en.ui.saves.errors

> **errors**: `object`

#### en.ui.saves.errors.actionFailed

> **actionFailed**: `string` = `"An error occurred. Please check the console for details."`

#### en.ui.saves.slot

> **slot**: `object`

#### en.ui.saves.slot.empty

> **empty**: `string` = `"Empty Slot"`

#### en.ui.saves.slot.label

> **label**: `string` = `"Slot {{number}}"`

#### en.ui.saves.slot.overwrite

> **overwrite**: `string` = `"Overwrite"`

#### en.ui.saves.slot.saveHere

> **saveHere**: `string` = `"Save Here"`

#### en.ui.saves.title

> **title**: `object`

#### en.ui.saves.title.load

> **load**: `string` = `"Load Game"`

#### en.ui.saves.title.save

> **save**: `string` = `"Save Game"`

#### en.ui.saves.title.saveLoad

> **saveLoad**: `string` = `"Save / Load Game"`

## Remarks

Registered automatically when the package is imported, so a game gets working
text without wiring anything. Exported for merging them by hand into
`Game.init({ translations: { resources } })`.
