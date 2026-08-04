# Type Alias: ChoiceOption

> **ChoiceOption** = `object`

Defined in: [scripts/types.ts:116](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L116)

One selectable reply.

## Properties

### content

> **content**: [`TextInput`](TextInput.md)

Defined in: [scripts/types.ts:118](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L118)

Label shown to the player, and logged once chosen.

***

### next?

> `optional` **next**: [`Script`](Script.md) \| () => `void`

Defined in: [scripts/types.ts:126](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/scripts/types.ts#L126)

What happens after the reply is logged.

A script is played in the same chat, a function is called, and omitting it
simply continues the current script.
