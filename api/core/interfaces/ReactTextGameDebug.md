# Interface: ReactTextGameDebug

Defined in: [packages/core/src/global.d.ts:5](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L5)

## Properties

### currentPassage

> `readonly` **currentPassage**: [`Passage`](../classes/Passage.md) \| `null`

Defined in: [packages/core/src/global.d.ts:8](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L8)

***

### Game

> **Game**: *typeof* [`Game`](../classes/Game.md)

Defined in: [packages/core/src/global.d.ts:6](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L6)

***

### getPassage()

> **getPassage**: (`passageId`) => [`Passage`](../classes/Passage.md) \| `null`

Defined in: [packages/core/src/global.d.ts:12](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L12)

Retrieves a passage by its unique identifier.

#### Parameters

##### passageId

`string`

The unique ID of the passage to retrieve.

#### Returns

[`Passage`](../classes/Passage.md) \| `null`

The passage object if found, or null if no passage exists with the given ID.

#### Throws

Error if Game.init() has not been called

***

### getState()

> **getState**: (`_fromI`) => [`GameSaveState`](../type-aliases/GameSaveState.md)

Defined in: [packages/core/src/global.d.ts:13](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L13)

Captures the complete game state including all entities and passages.

This method:
1. Saves the Game's internal state (current passage)
2. Saves all registered entity states
3. Returns the complete state object

#### Parameters

##### \_fromI

`boolean` = `false`

#### Returns

[`GameSaveState`](../type-aliases/GameSaveState.md)

The complete serializable game state

#### Throws

Error if Game.init() has not been called

#### Example

```typescript
const savedState = Game.getState();
localStorage.setItem('save1', JSON.stringify(savedState));
```

***

### jumpTo()

> **jumpTo**: (`passage`) => `void`

Defined in: [packages/core/src/global.d.ts:11](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L11)

Navigates the game to a specified passage.

On each call, generates a new unique renderId to enable React components
to force remounts when revisiting the same passage. This is useful for
resetting component state, restarting animations, or clearing forms.

#### Parameters

##### passage

The passage object or identifier of the passage to jump to.

`string` | [`Passage`](../classes/Passage.md)

#### Returns

`void`

Does not return any value.

#### Throws

Throws an error if the specified passage is not found or if Game.init() has not been called

#### Example

```typescript
// Jump to a passage by ID
Game.jumpTo('intro');

// Jump to a passage object
const chapter1 = newStory('chapter1', () => [...]);
Game.jumpTo(chapter1);

// Jumping to the same passage multiple times will generate different renderIds
Game.jumpTo('combat'); // renderId: "1234567890-0.123"
Game.jumpTo('combat'); // renderId: "1234567891-0.456" (different!)
```

***

### passages

> `readonly` **passages**: [`Passage`](../classes/Passage.md)[]

Defined in: [packages/core/src/global.d.ts:10](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L10)

***

### setState()

> **setState**: (`state`) => `void`

Defined in: [packages/core/src/global.d.ts:14](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L14)

Restores the complete game state including all entities and passages.

This method:
1. Sets the Storage state
2. Loads the Game's internal state (current passage)
3. Loads all registered entity states

#### Parameters

##### state

[`GameSaveState`](../type-aliases/GameSaveState.md)

The game state to restore

#### Returns

`void`

#### Throws

Error if Game.init() has not been called

#### Example

```typescript
const savedState = JSON.parse(localStorage.getItem('save1'));
Game.setState(savedState);
```

***

### state

> `readonly` **state**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/global.d.ts:9](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L9)

***

### Storage

> **Storage**: *typeof* `Storage`

Defined in: [packages/core/src/global.d.ts:7](https://github.com/laruss/react-text-game/blob/199548cab9df84ae40a459c5cbe3bdd9abb88813/packages/core/src/global.d.ts#L7)
