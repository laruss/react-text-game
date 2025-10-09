# Type Alias: StoryContent()

> **StoryContent** = \<`T`\>(`props`) => [`Component`](Component.md)[]

Defined in: [passages/story/types.ts:909](https://github.com/laruss/react-text-game/blob/5d1b7f722e0508dc7727e83f20112624d7c139f7/packages/core/src/passages/story/types.ts#L909)

Function type for story content generation.
Receives props and returns an array of components to display.

## Type Parameters

### T

`T` *extends* [`InitVarsType`](InitVarsType.md) = [`EmptyObject`](EmptyObject.md)

Type of props passed to the story (extends InitVarsType)

## Parameters

### props

`T`

Properties used for conditional rendering or dynamic content

## Returns

[`Component`](Component.md)[]

Array of components that make up the story

## Example

```typescript
// Simple static story
const story: StoryContent = () => [
  { type: 'header', content: 'Welcome' },
  { type: 'text', content: 'Your adventure begins...' }
];

// Dynamic story based on game state
const story: StoryContent<{ playerName: string; hasKey: boolean }> = (props) => [
  { type: 'text', content: `Hello, ${props.playerName}!` },
  {
    type: 'actions',
    content: [
      {
        label: 'Open Door',
        action: () => Game.jumpTo('next-room'),
        isDisabled: !props.hasKey,
        tooltip: props.hasKey ? undefined : {
          content: 'You need a key to open this door'
        }
      }
    ]
  }
];
```

## Remarks

The function is called during rendering, so:
- Keep logic lightweight for performance
- Access reactive game state through props for dynamic content
- Return value is memoized based on props
