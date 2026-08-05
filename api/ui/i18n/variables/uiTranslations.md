# Variable: uiTranslations

> `const` **uiTranslations**: `object`

Defined in: [index.ts:3](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/ui/src/i18n/index.ts#L3)

## Type Declaration

### en

> `readonly` **en**: `object`

#### en.ui

> **ui**: `object`

English defaults for the `ui` namespace.

##### Remarks

A TypeScript module rather than JSON on purpose: Node's ESM resolver requires
an `with { type: "json" }` import attribute for JSON modules, so a bare JSON
import makes this entry unloadable under plain Node (SSR, or `Game.init`
reaching it through core's dynamic import).

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
