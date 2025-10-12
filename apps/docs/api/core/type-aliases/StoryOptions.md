# Type Alias: StoryOptions

> **StoryOptions** = `object`

Defined in: [passages/story/types.ts:932](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L932)

Configuration options for story appearance and behavior.
Applied to the entire story passage.

## Example

```typescript
const options: StoryOptions = {
  background: {
    image: '/backgrounds/forest.jpg'
  },
  classNames: {
    base: 'min-h-screen bg-cover bg-center',
    container: 'max-w-4xl mx-auto p-8'
  }
};

newStory('forest-scene', () => [...], options);
```

## Properties

### background?

> `optional` **background**: `object`

Defined in: [passages/story/types.ts:936](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L936)

Background configuration for the story.

#### image?

> `optional` **image**: `string` \| () => `string`

URL or path to the background image.
Can be a static string or a function that returns a string for dynamic backgrounds.

##### Example

```typescript
// Static background
image: '/backgrounds/castle.jpg'

// Dynamic background based on game state
image: () => player.location === 'night'
  ? '/backgrounds/castle-night.jpg'
  : '/backgrounds/castle-day.jpg'
```

***

### classNames?

> `optional` **classNames**: `object`

Defined in: [passages/story/types.ts:958](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/core/src/passages/story/types.ts#L958)

CSS class name overrides for story layout.

#### base?

> `optional` **base**: `string`

CSS class for the outermost story container.
Controls overall layout, background, and viewport settings.

##### Example

```typescript
base: 'min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-black'
```

#### container?

> `optional` **container**: `string`

CSS class for the inner content container.
Controls content width, padding, and component spacing.

##### Example

```typescript
container: 'max-w-2xl p-6 bg-card/90 backdrop-blur-sm rounded-xl shadow-2xl'
```
