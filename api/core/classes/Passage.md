# Class: Passage

Defined in: [packages/core/src/passages/passage.ts:29](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L29)

Base class for all passage types in the text game engine.

Passages represent different screens or scenes in the game. Each passage has a unique
identifier and type, and is automatically registered with the Game when instantiated.

Subclasses must implement the `display()` method to define how the passage renders.

## Example

```typescript
class CustomPassage extends Passage {
  constructor(id: string) {
    super(id, 'custom');
  }

  display(props) {
    return { content: 'Custom passage content' };
  }
}
```

## See

 - Story - Text-based narrative passage implementation
 - InteractiveMap - Map-based interactive passage implementation
 - Widget - React component passage implementation

## Extended by

- [`InteractiveMap`](InteractiveMap.md)
- [`Story`](Story.md)
- [`Widget`](Widget.md)

## Constructors

### Constructor

> **new Passage**(`id`, `type`): `Passage`

Defined in: [packages/core/src/passages/passage.ts:55](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L55)

Creates a new passage and automatically registers it with the Game.

#### Parameters

##### id

`string`

Unique identifier for this passage

##### type

[`PassageType`](../type-aliases/PassageType.md)

The passage type (story, interactiveMap, or widget)

#### Returns

`Passage`

## Properties

### \_lastDisplayResult

> `protected` **\_lastDisplayResult**: `unknown` = `null`

Defined in: [packages/core/src/passages/passage.ts:47](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L47)

**`Internal`**

Cached result from the last display() call.
Used to access display data without re-executing content functions.

***

### id

> `readonly` **id**: `string`

Defined in: [packages/core/src/passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [packages/core/src/passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

## Methods

### display()

> **display**\<`T`\>(`_props`): `void`

Defined in: [packages/core/src/passages/passage.ts:71](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L71)

Renders the passage content with optional props.

This method must be implemented by subclasses to define the passage behavior.

#### Type Parameters

##### T

`T` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`EmptyObject`](../type-aliases/EmptyObject.md)

Type of props passed to the display method

#### Parameters

##### \_props

`T` = `...`

Optional properties for rendering the passage

#### Returns

`void`

The rendered passage content (type depends on passage implementation)

#### Throws

Error if not implemented by subclass

***

### getLastDisplayResult()

> **getLastDisplayResult**\<`T`\>(): `T` \| `null`

Defined in: [packages/core/src/passages/passage.ts:96](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L96)

Returns the cached result from the last display() call.
Use this method to access passage data without re-executing content functions,
which prevents unwanted side effects.

#### Type Parameters

##### T

`T` = `unknown`

Expected return type

#### Returns

`T` \| `null`

The cached display result, or null if display() has never been called

#### Example

```typescript
const story = newStory('test', () => [{ type: 'text', content: 'Hello' }]);

// First call to display() - executes content function
const result = story.display();

// Get cached result - does NOT execute content function again
const cached = story.getLastDisplayResult();
```

***

### hasDisplayCache()

> **hasDisplayCache**(): `boolean`

Defined in: [packages/core/src/passages/passage.ts:105](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/passages/passage.ts#L105)

Checks if a cached display result exists.

#### Returns

`boolean`

true if display() has been called at least once, false otherwise
