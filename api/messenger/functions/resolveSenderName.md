# Function: resolveSenderName()

> **resolveSenderName**(`id`): `string`

Defined in: [contacts.ts:103](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/messenger/src/contacts.ts#L103)

Resolves a sender id to a display name.

Falls back to the sender id when the contact has no name or was never
defined, so an unknown sender still renders something meaningful.

## Parameters

### id

`string`

Contact id, `"player"`, or `"system"`

## Returns

`string`
