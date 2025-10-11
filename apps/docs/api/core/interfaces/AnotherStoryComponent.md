# Interface: AnotherStoryComponent

Defined in: [passages/story/types.ts:587](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/story/types.ts#L587)

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

Defined in: [passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/story/types.ts#L24)

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

Defined in: [passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/story/types.ts#L39)

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

Defined in: [passages/story/types.ts:607](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/story/types.ts#L607)

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

Defined in: [passages/story/types.ts:591](https://github.com/laruss/react-text-game/blob/69d70d1469d5c42a37ce3eebe7e9ba2b0e018eba/packages/core/src/passages/story/types.ts#L591)

Discriminator property identifying this as an embedded story component.
