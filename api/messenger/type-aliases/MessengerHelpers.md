# Type Alias: MessengerHelpers

> **MessengerHelpers** = `object`

Defined in: [scripts/types.ts:215](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L215)

Toolbox handed to a [defineScript](../functions/defineScript.md) builder.

## Properties

### choice()

> **choice**: (`id`, `options`) => [`ChoiceBeatInput`](ChoiceBeatInput.md)

Defined in: [scripts/types.ts:249](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L249)

Blocks until the player picks a reply.

#### Parameters

##### id

`string`

##### options

[`ChoiceOption`](ChoiceOption.md)[]

#### Returns

[`ChoiceBeatInput`](ChoiceBeatInput.md)

***

### from()

> **from**: (`sender`) => [`SenderScope`](SenderScope.md)

Defined in: [scripts/types.ts:226](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L226)

Scopes the following builders to a sender.

#### Parameters

##### sender

[`Contact`](Contact.md) | `string`

#### Returns

[`SenderScope`](SenderScope.md)

***

### image()

> **image**: (`src`, `options?`) => [`MediaItemInput`](MediaItemInput.md)

Defined in: [scripts/types.ts:220](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L220)

Builds an image item for a media message.

#### Parameters

##### src

`string`

##### options?

[`MediaItemOptions`](MediaItemOptions.md)

#### Returns

[`MediaItemInput`](MediaItemInput.md)

***

### player

> **player**: [`SenderScope`](SenderScope.md)

Defined in: [scripts/types.ts:229](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L229)

Builders scoped to the player.

***

### system()

> **system**: (`key`, `params?`, `options?`) => [`SystemBeatInput`](SystemBeatInput.md)

Defined in: [scripts/types.ts:232](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L232)

An in-fiction system notice such as a member joining.

#### Parameters

##### key

`string`

##### params?

[`Params`](Params.md)

##### options?

`Pick`\<[`MessageOptions`](MessageOptions.md), `"id"`\>

#### Returns

[`SystemBeatInput`](SystemBeatInput.md)

***

### t()

> **t**: (`key`, `params?`) => [`I18nText`](I18nText.md)

Defined in: [scripts/types.ts:217](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L217)

Marks a translation key. See [t](../functions/t.md).

#### Parameters

##### key

`string`

##### params?

[`Params`](Params.md)

#### Returns

[`I18nText`](I18nText.md)

***

### typing()

> **typing**: (`sender`, `ms`, `options?`) => [`TypingBeatInput`](TypingBeatInput.md)

Defined in: [scripts/types.ts:239](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L239)

Shows a typing indicator, then delivers the next beat.

#### Parameters

##### sender

[`Contact`](Contact.md) | `string`

##### ms

`number`

##### options?

`Pick`\<[`MessageOptions`](MessageOptions.md), `"id"`\>

#### Returns

[`TypingBeatInput`](TypingBeatInput.md)

***

### video()

> **video**: (`src`, `options?`) => [`MediaItemInput`](MediaItemInput.md)

Defined in: [scripts/types.ts:223](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L223)

Builds a video item for a media message.

#### Parameters

##### src

`string`

##### options?

[`MediaItemOptions`](MediaItemOptions.md)

#### Returns

[`MediaItemInput`](MediaItemInput.md)

***

### wait()

> **wait**: (`ms`, `options?`) => [`WaitBeatInput`](WaitBeatInput.md)

Defined in: [scripts/types.ts:246](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L246)

Delays the next beat by `ms` of game time.

#### Parameters

##### ms

`number`

##### options?

`Pick`\<[`MessageOptions`](MessageOptions.md), `"id"`\>

#### Returns

[`WaitBeatInput`](WaitBeatInput.md)

***

### when()

> **when**: \<`T`\>(`condition`, `value`) => `T` \| `undefined`

Defined in: [scripts/types.ts:252](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/messenger/src/scripts/types.ts#L252)

Returns `value` when `condition` is truthy, otherwise `undefined`.

#### Type Parameters

##### T

`T`

#### Parameters

##### condition

`unknown`

##### value

`T` | () => `T`

#### Returns

`T` \| `undefined`
