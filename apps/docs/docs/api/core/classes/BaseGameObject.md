# Class: BaseGameObject\<VariablesType\>

Defined in: [gameObjects/baseGameObject.ts:34](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L34)

Base class for all game entities in the text game engine.

Provides automatic registration with the Game registry, reactive state management
via Valtio proxies, and persistence through the Storage system using JSONPath.

## Example

```typescript
class Player extends BaseGameObject<{ health: number; name: string }> {
  constructor() {
    super({
      id: 'player',
      variables: { health: 100, name: 'Hero' }
    });
  }

  takeDamage(amount: number) {
    this._variables.health -= amount;
    this.save();
  }
}

const player = new Player();
```

## Type Parameters

### VariablesType

`VariablesType` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md) = [`InitVarsType`](../type-aliases/InitVarsType.md)

The type definition for entity variables, must extend InitVarsType

## Constructors

### Constructor

> **new BaseGameObject**\<`VariablesType`\>(`props`): `BaseGameObject`\<`VariablesType`\>

Defined in: [gameObjects/baseGameObject.ts:56](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L56)

Creates a new game object and automatically registers it with the Game registry.

#### Parameters

##### props

Configuration object for the game object

###### id

`string`

Unique identifier for this object

###### variables?

`VariablesType`

Optional initial variables for this object

#### Returns

`BaseGameObject`\<`VariablesType`\>

## Properties

### \_variables

> `protected` **\_variables**: `VariablesType`

Defined in: [gameObjects/baseGameObject.ts:47](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L47)

Internal storage for entity variables.
Protected to allow derived classes to modify state directly.

***

### id

> `readonly` **id**: `string`

Defined in: [gameObjects/baseGameObject.ts:41](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L41)

Unique identifier for this game object.
Used for registry lookup and storage path generation.

## Accessors

### variables

#### Get Signature

> **get** **variables**(): `VariablesType`

Defined in: [gameObjects/baseGameObject.ts:67](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L67)

Read-only accessor for entity variables.

##### Returns

`VariablesType`

The current variables object for this entity

## Methods

### load()

> **load**(): `void`

Defined in: [gameObjects/baseGameObject.ts:92](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L92)

Loads this object's variables from the Storage system.

If saved data exists, it merges into the current variables.
If no saved data exists, clears all variables.

#### Returns

`void`

#### Example

```typescript
player.load(); // Restores player state from storage
```

***

### save()

> **save**(): `void`

Defined in: [gameObjects/baseGameObject.ts:114](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/gameObjects/baseGameObject.ts#L114)

Saves this object's current variables to the Storage system.

Uses Valtio's snapshot to create a plain object copy before saving.

#### Returns

`void`

#### Example

```typescript
player._variables.health = 50;
player.save(); // Persists the change
```
