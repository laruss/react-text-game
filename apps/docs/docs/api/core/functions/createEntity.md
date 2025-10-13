# Function: createEntity()

> **createEntity**\<`Vars`\>(`id`, `variables`): [`SimpleObject`](../type-aliases/SimpleObject.md)\<`Vars`\>

Defined in: [gameObjects/fabric.ts:20](https://github.com/laruss/react-text-game/blob/56d052e07c46af6beb5ea69677296eefae694e61/packages/core/src/gameObjects/fabric.ts#L20)

Convenience factory that wraps [SimpleObject](../type-aliases/SimpleObject.md) creation.

This function mirrors the fabric-style APIs used for passages so entity
authors can define state in plain objects and still get reactive behaviour.
The created entity is registered with the game engine via the
`BaseGameObject` constructor and exposes its variables as direct
properties.

## Type Parameters

### Vars

`Vars` *extends* [`InitVarsType`](../type-aliases/InitVarsType.md)

## Parameters

### id

`string`

Unique identifier used for registry lookups and persistence.

### variables

`Vars`

Initial reactive state for the entity. Nested objects and
arrays are supported and proxied.

## Returns

[`SimpleObject`](../type-aliases/SimpleObject.md)\<`Vars`\>

A `SimpleObject` instance that can be used anywhere a
`BaseGameObject` is expected.
