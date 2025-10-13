# Class: Passage

Defined in: [passages/passage.ts:29](https://github.com/laruss/react-text-game/blob/4915125f9c22f1259a088eb59b920654db3f32d0/packages/core/src/passages/passage.ts#L29)

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

Defined in: [passages/passage.ts:48](https://github.com/laruss/react-text-game/blob/4915125f9c22f1259a088eb59b920654db3f32d0/packages/core/src/passages/passage.ts#L48)

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

### id

> `readonly` **id**: `string`

Defined in: [passages/passage.ts:34](https://github.com/laruss/react-text-game/blob/4915125f9c22f1259a088eb59b920654db3f32d0/packages/core/src/passages/passage.ts#L34)

Unique identifier for this passage.
Used for navigation and registry lookup.

***

### type

> `readonly` **type**: [`PassageType`](../type-aliases/PassageType.md)

Defined in: [passages/passage.ts:40](https://github.com/laruss/react-text-game/blob/4915125f9c22f1259a088eb59b920654db3f32d0/packages/core/src/passages/passage.ts#L40)

The type of this passage.
Determines how the passage should be rendered in the UI.

## Methods

### display()

> **display**\<`T`\>(`_props`): `void`

Defined in: [passages/passage.ts:65](https://github.com/laruss/react-text-game/blob/4915125f9c22f1259a088eb59b920654db3f32d0/packages/core/src/passages/passage.ts#L65)

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
