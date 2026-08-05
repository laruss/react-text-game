# Function: defineContact()

> **defineContact**(`id`, `options`): [`Contact`](../type-aliases/Contact.md)

Defined in: [contacts.ts:59](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/messenger/src/contacts.ts#L59)

Defines a chat participant.

## Parameters

### id

`string`

Unique, persistent identifier

### options

[`ContactOptions`](../type-aliases/ContactOptions.md) = `{}`

Display name, avatar, and any author metadata

## Returns

[`Contact`](../type-aliases/Contact.md)

The contact, usable anywhere a sender is expected

## Throws

Error if the id is already taken or is a reserved sender id

## Example

```typescript
import { defineContact, m } from '@react-text-game/messenger';

export const anna = defineContact('anna', {
  name: m.t('contacts.anna'),
  avatar: '/avatars/anna.webp',
});
```
