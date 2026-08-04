# Function: resolveSenderName()

> **resolveSenderName**(`id`): `string`

Defined in: [contacts.ts:103](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/messenger/src/contacts.ts#L103)

Resolves a sender id to a display name.

Falls back to the sender id when the contact has no name or was never
defined, so an unknown sender still renders something meaningful.

## Parameters

### id

`string`

Contact id, `"player"`, or `"system"`

## Returns

`string`
