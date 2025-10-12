# Type Alias: ConversationBubble

> **ConversationBubble** = `object`

Defined in: [passages/story/types.ts:650](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L650)

Represents a single message/bubble in a conversation sequence.
Can include speaker information, avatar, and custom styling.

## Example

```typescript
// Simple message
{ content: 'Hello there!' }

// Message with speaker
{
  content: 'How can I help you?',
  who: { name: 'Shopkeeper' },
  side: 'left'
}

// Message with avatar
{
  content: 'I need supplies.',
  who: {
    name: 'Player',
    avatar: '/avatars/player.png'
  },
  side: 'right'
}

// Message with custom color
{
  content: 'System message',
  color: '#ff6b6b',
  side: 'left'
}
```

## Properties

### color?

> `optional` **color**: `` `#${string}` ``

Defined in: [passages/story/types.ts:693](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L693)

Optional custom background color for the message bubble.
Must be a valid hex color code.

#### Example

```typescript
color: '#3b82f6'  // Blue
color: '#ef4444'  // Red
```

#### Remarks

When not provided, the color is determined by the conversation variant and side.

***

### content

> **content**: `ReactNode`

Defined in: [passages/story/types.ts:678](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L678)

The message content to display.
Supports strings, JSX elements, and any valid React node.

***

### props?

> `optional` **props**: `object`

Defined in: [passages/story/types.ts:709](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L709)

Optional CSS class overrides for fine-grained styling control.

#### classNames?

> `optional` **classNames**: `object`

CSS class names for different parts of the bubble.

##### classNames.avatar?

> `optional` **avatar**: `string`

CSS class for the avatar element.
Controls avatar size, shape, and positioning.

##### classNames.base?

> `optional` **base**: `string`

CSS class for the entire bubble container.
Controls layout, spacing, and alignment.

##### classNames.content?

> `optional` **content**: `string`

CSS class for the message content area.
Controls text styling, padding, and background.

***

### side?

> `optional` **side**: [`ConversationBubbleSide`](ConversationBubbleSide.md)

Defined in: [passages/story/types.ts:704](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L704)

Which side of the conversation to display this message.

#### Default Value

`"left"`

#### Remarks

- `"left"` - Typically used for NPCs or other characters
- `"right"` - Typically used for the player character

***

### who?

> `optional` **who**: `object`

Defined in: [passages/story/types.ts:654](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L654)

Optional speaker information for this message.

#### avatar?

> `optional` **avatar**: `string`

URL or path to the speaker's avatar image.
If not provided, a generated avatar with the first letter of the name is shown.

##### Example

```typescript
avatar: '/characters/merchant.png'
avatar: 'https://example.com/avatars/123.jpg'
```

#### name?

> `optional` **name**: `string`

Display name of the speaker.
Shown with the message or as avatar fallback (first letter).
