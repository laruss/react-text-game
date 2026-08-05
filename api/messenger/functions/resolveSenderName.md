# Function: resolveSenderName()

> **resolveSenderName**(`id`): `string`

Defined in: [contacts.ts:103](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/contacts.ts#L103)

Resolves a sender id to a display name.

Falls back to the sender id when the contact has no name or was never
defined, so an unknown sender still renders something meaningful.

## Parameters

### id

`string`

Contact id, `"player"`, or `"system"`

## Returns

`string`
