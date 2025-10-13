# Interface: ConversationComponent

Defined in: [passages/story/types.ts:791](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L791)

Component for displaying dialogue, conversations, or sequential messages.
Supports different visual styles and progressive message reveal.

## Example

```typescript
// All messages shown at once (default)
{
  type: 'conversation',
  content: [
    { content: 'Hello!', who: { name: 'NPC' }, side: 'left' },
    { content: 'Hi there!', who: { name: 'Player' }, side: 'right' }
  ]
}

// Progressive reveal - click to show next message
{
  type: 'conversation',
  appearance: 'byClick',
  content: [
    { content: 'Let me tell you a story...', side: 'left' },
    { content: 'It was a dark and stormy night...', side: 'left' },
    { content: 'When suddenly...', side: 'left' }
  ]
}

// Messenger-style conversation
{
  type: 'conversation',
  props: { variant: 'messenger' },
  content: [
    {
      content: 'Check out this new quest!',
      who: { name: 'Guild Master', avatar: '/guild.png' },
      side: 'left'
    },
    {
      content: 'I\'m interested!',
      who: { name: 'You' },
      side: 'right'
    }
  ]
}
```

## Extends

- `BaseComponent`

## Properties

### appearance?

> `optional` **appearance**: [`ConversationAppearance`](../type-aliases/ConversationAppearance.md)

Defined in: [passages/story/types.ts:815](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L815)

Controls how messages are revealed to the player.

#### Default Value

`"atOnce"`

#### Remarks

- `"atOnce"` - All messages visible immediately (default)
- `"byClick"` - Messages appear one at a time when clicked
  - Creates a progressive storytelling effect
  - Click anywhere in the conversation area to reveal the next message
  - Useful for paced dialogue or dramatic reveals

***

### content

> **content**: [`ConversationBubble`](../type-aliases/ConversationBubble.md)[]

Defined in: [passages/story/types.ts:801](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L801)

Array of conversation bubbles/messages to display.
Order determines the sequence in which messages appear.

***

### id?

> `optional` **id**: `string`

Defined in: [passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L24)

Optional unique identifier for this component.
Can be used to reference or manipulate specific components programmatically.

#### Example

```typescript
{ type: 'text', id: 'intro-text', content: 'Welcome!' }
```

#### Inherited from

`BaseComponent.id`

***

### initialVariant?

> `optional` **initialVariant**: `"hidden"` \| `"display"` \| `"disclosure"`

Defined in: [passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L39)

Controls the initial visibility state of the component.

#### Remarks

This property is designed for future UI implementation to support dynamic component visibility.
Currently defined but not yet implemented in the UI layer.

- `"display"` - Component is visible and rendered immediately (default behavior)
- `"hidden"` - Component exists but is not visible initially
- `"disclosure"` - Component is initially collapsed/hidden but can be expanded by user interaction

#### Default Value

`"display"`

#### Inherited from

`BaseComponent.initialVariant`

***

### props?

> `optional` **props**: `object`

Defined in: [passages/story/types.ts:820](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L820)

Optional configuration for visual style and layout.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the conversation container.

##### Example

```typescript
props: { className: 'my-8 p-4 bg-muted-50 rounded-lg' }
```

#### variant?

> `optional` **variant**: [`ConversationVariant`](../type-aliases/ConversationVariant.md)

Visual style preset for the conversation.

##### Default Value

`"chat"`

##### Remarks

- `"chat"` - Casual chat interface style
  - Rounded bubbles with colored backgrounds
  - Minimal shadows, compact layout
  - Good for informal conversations

- `"messenger"` - Messaging app style (like SMS or WhatsApp)
  - Card-like bubbles with shadows
  - More pronounced visual separation
  - Professional appearance, good for important dialogues

***

### type

> **type**: `"conversation"`

Defined in: [passages/story/types.ts:795](https://github.com/laruss/react-text-game/blob/7602514695c2b4f79da2fb62137ed33ba5572ba4/packages/core/src/passages/story/types.ts#L795)

Discriminator property identifying this as a conversation component.
