# Class: Game

Defined in: [game.ts:52](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L52)

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

> **get** `static` **currentPassage**(): `null` \| [`Passage`](Passage.md)

Defined in: [game.ts:144](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L144)

Retrieves the current passage from the passage registry based on the current passage ID in the game state.
If the current passage ID is null or the passage cannot be found, returns null.

##### Throws

Error if Game.init() has not been called

##### Returns

`null` \| [`Passage`](Passage.md)

The current passage object or null if not available.

***

### options

#### Get Signature

> **get** `static` **options**(): [`Options`](../type-aliases/Options.md)

Defined in: [game.ts:551](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L551)

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

Defined in: [game.ts:133](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L133)

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

Defined in: [game.ts:245](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L245)

Provides access to the internal game state for reactive hooks.

##### Throws

Error if Game.init() has not been called

##### Returns

`object`

The game's internal reactive state

###### currentPassageId

> **currentPassageId**: `null` \| `string`

## Methods

### \_getAllProxiedObjects()

> `static` **\_getAllProxiedObjects**(): [`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>[]

Defined in: [game.ts:235](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L235)

**`Internal`**

Retrieves all proxied objects from the object registry.

 - Used for batch operations during save/load

#### Returns

[`BaseGameObject`](BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>[]

An array of BaseGameObject instances stored in the object registry

***

### \_getProxiedObject()

> `static` **\_getProxiedObject**\<`T`\>(`object`): `T`

Defined in: [game.ts:225](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L225)

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

Defined in: [game.ts:577](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L577)

**`Internal`**

Resets the game state for testing purposes.

Clears all entity and passage registries, disables auto-save, and resets initialization state.
This method is intended for use in test environments only.

#### Returns

`void`

***

### clearAutoSave()

> `static` **clearAutoSave**(): `void`

Defined in: [game.ts:476](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L476)

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

Defined in: [game.ts:408](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L408)

Disables auto-save functionality and clears all subscriptions.

Cleans up all Valtio subscriptions and cancels any pending debounced saves.

#### Returns

`void`

#### Throws

Error if Game.init() has not been called

***

### enableAutoSave()

> `static` **enableAutoSave**(): `void`

Defined in: [game.ts:374](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L374)

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

Defined in: [game.ts:171](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L171)

Retrieves all the passages from the passages registry.

#### Returns

[`Passage`](Passage.md)[]

An array containing all the Passage objects.

#### Throws

Error if Game.init() has not been called

***

### getPassageById()

> `static` **getPassageById**(`passageId`): `null` \| [`Passage`](Passage.md)

Defined in: [game.ts:160](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L160)

Retrieves a passage by its unique identifier.

#### Parameters

##### passageId

`string`

The unique ID of the passage to retrieve.

#### Returns

`null` \| [`Passage`](Passage.md)

The passage object if found, or null if no passage exists with the given ID.

#### Throws

Error if Game.init() has not been called

***

### getState()

> `static` **getState**(`_fromI`): [`GameSaveState`](../type-aliases/GameSaveState.md)

Defined in: [game.ts:302](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L302)

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

Defined in: [game.ts:503](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L503)

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

Defined in: [game.ts:183](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L183)

Navigates the game to a specified passage.

#### Parameters

##### passage

The passage object or identifier of the passage to jump to.

`string` | [`Passage`](Passage.md)

#### Returns

`void`

Does not return any value.

#### Throws

Throws an error if the specified passage is not found or if Game.init() has not been called

***

### loadFromSessionStorage()

> `static` **loadFromSessionStorage**(): `boolean`

Defined in: [game.ts:446](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L446)

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

Defined in: [game.ts:84](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L84)

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

Defined in: [game.ts:105](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L105)

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

Defined in: [game.ts:208](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L208)

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

Defined in: [game.ts:331](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L331)

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

Defined in: [game.ts:563](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/game.ts#L563)

Updates the game options with the provided settings.

#### Parameters

##### options

[`NewOptions`](../type-aliases/NewOptions.md)

The new options to update the game configuration.

#### Returns

`void`

No return value.
