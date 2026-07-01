# Interface: AnotherStoryComponent

Defined in: [packages/core/src/passages/story/types.ts:607](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/story/types.ts#L607)

Component for embedding another story passage within the current story.
Enables composition and reuse of story content.

## Example

```typescript
// Main story that includes a shared intro
newStory('chapter-1', () => [
  { type: 'anotherStory', storyId: 'common-intro' },
  { type: 'text', content: 'Chapter 1 specific content...' }
]);

// Reusable story component
newStory('common-intro', () => [
  { type: 'header', content: 'Welcome', props: { level: 1 } },
  { type: 'text', content: 'This intro is shared across multiple chapters.' }
]);
```

## Remarks

Use this to:
- Reuse common story segments (intros, outros, recurring dialogues)
- Create modular story components
- Implement story templates or patterns
- Build complex narratives from smaller pieces

## Extends

- `BaseComponent`

## Properties

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:19](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/story/types.ts#L19)

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

Defined in: [packages/core/src/passages/story/types.ts:34](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/story/types.ts#L34)

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

### storyId

> **storyId**: `string`

Defined in: [packages/core/src/passages/story/types.ts:627](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/story/types.ts#L627)

The unique identifier of the story passage to embed.
Must reference a story that has been registered with `newStory()`.

#### Example

```typescript
storyId: 'common-intro'
storyId: 'character-dialogue-bob'
```

#### Remarks

If the referenced story ID doesn't exist, the component will fail to render.
Ensure the story is registered before it's referenced.

***

### type

> **type**: `"anotherStory"`

Defined in: [packages/core/src/passages/story/types.ts:611](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/passages/story/types.ts#L611)

Discriminator property identifying this as an embedded story component.
