# Type Alias: StoryHelpers

> **StoryHelpers** = [`CommonHelpers`](CommonHelpers.md) & `object`

Defined in: [packages/core/src/passages/story/helpers.ts:81](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/core/src/passages/story/helpers.ts#L81)

Toolbox handed to the content callback of [defineStory](../functions/defineStory.md).

Every helper builds a plain [Component](Component.md) object, so helper calls and
hand-written component literals can be mixed freely in the same array.

## Type Declaration

### actions()

> **actions**: (`content`, `options?`) => [`ActionsComponent`](../interfaces/ActionsComponent.md)

Creates a group of action buttons. Falsy entries are dropped.

#### Parameters

##### content

`ReadonlyArray`\<[`Conditional`](Conditional.md)\<[`ActionType`](ActionType.md)\>\>

##### options?

[`StoryActionsOptions`](StoryActionsOptions.md)

#### Returns

[`ActionsComponent`](../interfaces/ActionsComponent.md)

#### Example

```typescript
h.actions([
  { content: 'Go north', action: h.jump('north-room') },
  player.hasKey && { content: 'Unlock', action: h.jump('vault') }
], { direction: 'vertical' })
```

### conversation()

> **conversation**: (`content`, `options?`) => [`ConversationComponent`](../interfaces/ConversationComponent.md)

Creates a conversation component. Falsy bubbles are dropped.

#### Parameters

##### content

`ReadonlyArray`\<[`Conditional`](Conditional.md)\<[`ConversationBubble`](ConversationBubble.md)\>\>

##### options?

[`StoryConversationOptions`](StoryConversationOptions.md)

#### Returns

[`ConversationComponent`](../interfaces/ConversationComponent.md)

#### Example

```typescript
h.conversation([
  { content: 'Hello!', who: { name: 'NPC' }, side: 'left' },
  { content: 'Hi there!', side: 'right' }
], { appearance: 'byClick', variant: 'messenger' })
```

### header()

> **header**: (`content`, `options?`) => [`HeaderComponent`](../interfaces/HeaderComponent.md)

Creates a header component.

#### Parameters

##### content

`string`

##### options?

[`StoryHeaderOptions`](StoryHeaderOptions.md)

#### Returns

[`HeaderComponent`](../interfaces/HeaderComponent.md)

#### Example

```typescript
h.header('Chapter 1', { level: 1, className: 'text-center' })
```

### image()

> **image**: (`content`, `options?`) => [`ImageComponent`](../interfaces/ImageComponent.md)

Creates an image component.

#### Parameters

##### content

`string`

##### options?

[`StoryImageOptions`](StoryImageOptions.md)

#### Returns

[`ImageComponent`](../interfaces/ImageComponent.md)

#### Example

```typescript
h.image('/scene.jpg', { alt: 'A dark forest', disableModal: true })
```

### include()

> **include**: (`storyId`, `options?`) => [`AnotherStoryComponent`](../interfaces/AnotherStoryComponent.md)

Embeds another registered story passage.

#### Parameters

##### storyId

`string`

##### options?

[`StoryIncludeOptions`](StoryIncludeOptions.md)

#### Returns

[`AnotherStoryComponent`](../interfaces/AnotherStoryComponent.md)

#### Example

```typescript
h.include('common-intro')
```

### text()

> **text**: (`content`, `options?`) => [`TextComponent`](../interfaces/TextComponent.md)

Creates a text component.

#### Parameters

##### content

`ReactNode`

##### options?

[`StoryTextOptions`](StoryTextOptions.md)

#### Returns

[`TextComponent`](../interfaces/TextComponent.md)

#### Example

```typescript
h.text('Once upon a time...', { className: 'text-lg' })
h.text('<strong>Bold</strong>', { isHTML: true })
```

### video()

> **video**: (`content`, `options?`) => [`VideoComponent`](../interfaces/VideoComponent.md)

Creates a video component.

#### Parameters

##### content

`string`

##### options?

[`StoryVideoOptions`](StoryVideoOptions.md)

#### Returns

[`VideoComponent`](../interfaces/VideoComponent.md)

#### Example

```typescript
h.video('/cutscene.mp4', { controls: true, loop: false })
```

## Remarks

Each helper takes the component's content first and a single flat options
bag second. Fields that live under `props` in the raw component type are
hoisted into that bag, so there is only ever one level to fill in.
