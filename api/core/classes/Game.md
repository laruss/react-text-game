# Class: Game

Defined in: [packages/core/src/game.ts:55](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L55)

Central orchestrator for the text game engine.

The `Game` class manages all core game functionality including:
- Entity registration and proxying with Valtio for reactive state
- Passage registration and navigation
- State serialization and persistence
- Auto-save to session storage with debouncing

All entities and passages are automatically registered through their constructors,
and the Game provides static methods for navigation and state management.

## Example

```typescript
// Create entities and passages (auto-registered)
const player = new Player();
const intro = newStory('intro', () => [...]);

// Navigate
Game.jumpTo('intro');

// Save/Load
const state = Game.getState();
Game.setState(state);

// Auto-save
Game.enableAutoSave();
Game.loadFromSessionStorage();
```

## Constructors

### Constructor

> **new Game**(): `Game`

#### Returns

`Game`

## Accessors

### currentPassage

#### Get Signature

> **get** `static` **currentPassage**(): [`Passage`](Passage.md) \| `null`

Defined in: [packages/core/src/game.ts:197](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L197)

Retrieves the current passage from the passage registry based on the current passage ID in the game state.
If the current passage ID is null or the passage cannot be found, returns null.

##### Throws

Error if Game.init() has not been called

##### Returns

[`Passage`](Passage.md) \| `null`

The current passage object or null if not available.

***

### options

#### Get Signature

> **get** `static` **options**(): [`Options`](../type-aliases/Options.md)

Defined in: [packages/core/src/game.ts:724](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L724)

Gets the game options.

##### Throws

Error if Game.init() has not been called

##### Returns

[`Options`](../type-aliases/Options.md)

The current game options

***

### registeredPassages

#### Get Signature

> **get** `static` **registeredPassages**(): `IterableIterator`\<[`Passage`](Passage.md)\>

Defined in: [packages/core/src/game.ts:186](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L186)

Retrieves all registered passages from the passage registry.

##### Throws

Error if Game.init() has not been called

##### Returns

`IterableIterator`\<[`Passage`](Passage.md)\>

An iterator containing all the Passage objects.

***

### selfState

#### Get Signature

> **get** `static` **selfState**(): `object`

Defined in: [packages/core/src/game.ts:319](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L319)

Provides access to the internal game state for reactive hooks.

##### Throws

Error if Game.init() has not been called

##### Returns

`object`

The game's internal reactive state

###### currentPassageId

> **currentPassageId**: `string` \| `null`

###### renderId

> **renderId**: `string` \| `null`

## Methods

### \_getAllProxiedObjects()

> `static` **\_getAllProxiedObjects**(): [`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>[]

Defined in: [packages/core/src/game.ts:309](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L309)

**`Internal`**

Retrieves all proxied objects from the object registry.

 - Used for batch operations during save/load

#### Returns

[`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>[]

An array of BaseGameObject instances stored in the object registry

***

### \_getProxiedObject()

> `static` **\_getProxiedObject**\<`T`\>(`object`): `T`

Defined in: [packages/core/src/game.ts:299](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L299)

**`Internal`**

Retrieves the proxied object from the object registry based on its ID.
If the object is not found in the registry, the original object is returned.

 - Used by hooks for reactive state management

#### Type Parameters

##### T

`T` *extends* [`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>

#### Parameters

##### object

`T`

The original object to find in the registry

#### Returns

`T`

The proxied object from the registry if present, otherwise the original object

***

### \_resetForTesting()

> `static` **\_resetForTesting**(): `void`

Defined in: [packages/core/src/game.ts:750](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L750)

**`Internal`**

Resets the game state for testing purposes.

Clears all entity and passage registries, disables auto-save, and resets initialization state.
This method is intended for use in test environments only.

#### Returns

`void`

***

### clearAutoSave()

> `static` **clearAutoSave**(): `void`

Defined in: [packages/core/src/game.ts:550](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L550)

Clears the auto-saved state from session storage.

#### Returns

`void`

#### Throws

Error if Game.init() has not been called

#### Example

```typescript
Game.clearAutoSave(); // Remove auto-save data
```

***

### disableAutoSave()

> `static` **disableAutoSave**(): `void`

Defined in: [packages/core/src/game.ts:482](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L482)

Disables auto-save functionality and clears all subscriptions.

Cleans up all Valtio subscriptions and cancels any pending debounced saves.

#### Returns

`void`

#### Throws

Error if Game.init() has not been called

***

### enableAutoSave()

> `static` **enableAutoSave**(): `void`

Defined in: [packages/core/src/game.ts:448](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L448)

Enables auto-save functionality.

Subscribes to all game state changes (Game state and all entity states)
and automatically saves to session storage with 500ms debouncing.

#### Returns

`void`

#### Throws

Error if Game.init() has not been called

#### Example

```typescript
Game.enableAutoSave();
// Now any state change will auto-save after 500ms
player.health = 50; // Will trigger auto-save
```

***

### getAllPassages()

> `static` **getAllPassages**(): [`Passage`](Passage.md)[]

Defined in: [packages/core/src/game.ts:224](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L224)

Retrieves all the passages from the passages registry.

#### Returns

[`Passage`](Passage.md)[]

An array containing all the Passage objects.

#### Throws

Error if Game.init() has not been called

***

### getPassageById()

> `static` **getPassageById**(`passageId`): [`Passage`](Passage.md) \| `null`

Defined in: [packages/core/src/game.ts:213](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L213)

Retrieves a passage by its unique identifier.

#### Parameters

##### passageId

`string`

The unique ID of the passage to retrieve.

#### Returns

[`Passage`](Passage.md) \| `null`

The passage object if found, or null if no passage exists with the given ID.

#### Throws

Error if Game.init() has not been called

***

### getState()

> `static` **getState**(`_fromI`): [`GameSaveState`](../type-aliases/GameSaveState.md)

Defined in: [packages/core/src/game.ts:376](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L376)

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

### init()

> `static` **init**(`opts`): `Promise`\<`void`\>

Defined in: [packages/core/src/game.ts:577](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L577)

Initializes the game engine with the provided options.

This method MUST be called before any other Game methods can be used.
Calling this method marks the Game as initialized and allows access to all other functionality.

Optionally integrates with `@react-text-game/saves` package if installed.

#### Parameters

##### opts

[`NewOptions`](../type-aliases/NewOptions.md)

Configuration options for the game

#### Returns

`Promise`\<`void`\>

Promise that resolves when initialization is complete

#### Example

```typescript
await Game.init({
  // your options here
});

// Now you can use other Game methods
Game.jumpTo('start');
```

***

### jumpTo()

> `static` **jumpTo**(`passage`): `void`

Defined in: [packages/core/src/game.ts:254](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L254)

Navigates the game to a specified passage.

On each call, generates a new unique renderId to enable React components
to force remounts when revisiting the same passage. This is useful for
resetting component state, restarting animations, or clearing forms.

#### Parameters

##### passage

The passage object or identifier of the passage to jump to.

`string` | [`Passage`](Passage.md)

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

### loadFromSessionStorage()

> `static` **loadFromSessionStorage**(): `boolean`

Defined in: [packages/core/src/game.ts:520](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L520)

Loads game state from session storage if available.

#### Returns

`boolean`

True if state was loaded successfully, false otherwise

#### Throws

Error if Game.init() has not been called

#### Example

```typescript
if (Game.loadFromSessionStorage()) {
  console.log('Game loaded from auto-save');
} else {
  Game.jumpTo('start');
}
```

***

### registerEntity()

> `static` **registerEntity**(...`objects`): `void`

Defined in: [packages/core/src/game.ts:97](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L97)

Registers and proxies the provided game objects for further use by adding them to the object registry.

#### Parameters

##### objects

...[`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>[]

The array of BaseGameObject instances to be registered.

#### Returns

`void`

This method does not return a value.

***

### registerPassage()

> `static` **registerPassage**(...`passages`): `void`

Defined in: [packages/core/src/game.ts:151](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L151)

Registers one or more passages into the passage registry. Each passage must have a unique identifier.
Throws an error if a passage with the same id is already registered.

#### Parameters

##### passages

...[`Passage`](Passage.md)[]

The passages to be registered. Each passage should be an object containing an `id` property.

#### Returns

`void`

Does not return a value.

#### Throws

Error if Game.init() has not been called

***

### setCurrent()

> `static` **setCurrent**(`passage`): `void`

Defined in: [packages/core/src/game.ts:282](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L282)

Sets the current passage in the game state.

#### Parameters

##### passage

The passage to be set as current. Can be either a Passage object or a string representing the passage ID.

`string` | [`Passage`](Passage.md)

#### Returns

`void`

This method does not return a value.

#### Throws

Error if Game.init() has not been called

***

### setState()

> `static` **setState**(`state`): `void`

Defined in: [packages/core/src/game.ts:405](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L405)

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

### updateOptions()

> `static` **updateOptions**(`options`): `void`

Defined in: [packages/core/src/game.ts:736](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/game.ts#L736)

Updates the game options with the provided settings.

#### Parameters

##### options

[`NewOptions`](../type-aliases/NewOptions.md)

The new options to update the game configuration.

#### Returns

`void`

No return value.
