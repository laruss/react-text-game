# Type Alias: CommonHelpers

> **CommonHelpers** = `object`

Defined in: [packages/core/src/passages/definition.ts:61](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/definition.ts#L61)

Helpers available in every passage type's toolbox.

## Properties

### jump()

> **jump**: (`target`) => () => `void`

Defined in: [packages/core/src/passages/definition.ts:73](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/definition.ts#L73)

Builds a click handler that navigates to another passage.

#### Parameters

##### target

Passage instance or registered passage id

[`Passage`](../classes/Passage.md) | `string`

#### Returns

Callback suitable for any `action` field

> (): `void`

##### Returns

`void`

#### Example

```typescript
h.actions([{ label: 'Continue', action: h.jump('chapter-2') }]);
```

***

### when()

> **when**: \<`T`\>(`condition`, `value`) => `T` \| `undefined`

Defined in: [packages/core/src/passages/definition.ts:88](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/core/src/passages/definition.ts#L88)

Returns `value` when `condition` is truthy, otherwise `undefined`.

#### Type Parameters

##### T

`T`

#### Parameters

##### condition

`unknown`

##### value

`T` | () => `T`

#### Returns

`T` \| `undefined`

#### Remarks

Pass a function to defer evaluation until the condition passes. Plain
`&&` works just as well for simple cases; `when` exists for values that
are expensive to build or that would be falsy on their own.

#### Example

```typescript
h.when(player.hasMap, () => h.image('/map.png'));
```
