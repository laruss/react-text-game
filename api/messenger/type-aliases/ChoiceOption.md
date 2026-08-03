# Type Alias: ChoiceOption

> **ChoiceOption** = `object`

Defined in: [scripts/types.ts:116](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/scripts/types.ts#L116)

One selectable reply.

## Properties

### content

> **content**: [`TextInput`](TextInput.md)

Defined in: [scripts/types.ts:118](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/scripts/types.ts#L118)

Label shown to the player, and logged once chosen.

***

### next?

> `optional` **next**: [`Script`](Script.md) \| () => `void`

Defined in: [scripts/types.ts:126](https://github.com/laruss/react-text-game/blob/8eb82456bbd558066ac161867d5ee62b2a1d337c/packages/messenger/src/scripts/types.ts#L126)

What happens after the reply is logged.

A script is played in the same chat, a function is called, and omitting it
simply continues the current script.
