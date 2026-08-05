# Type Alias: CommonHelpers

> **CommonHelpers** = `object`

Defined in: [packages/core/src/passages/definition.ts:61](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/definition.ts#L61)

Helpers available in every passage type's toolbox.

## Properties

### jump()

> **jump**: (`target`) => () => `void`

Defined in: [packages/core/src/passages/definition.ts:75](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/definition.ts#L75)

Builds a click handler that navigates to another passage.

#### Parameters

##### target

[`PassageTarget`](PassageTarget.md)

Passage instance (`Story`, `InteractiveMap`, `Widget`) or
registered passage id

#### Returns

Callback suitable for any `action` field

> (): `void`

##### Returns

`void`

#### Example

```typescript
h.actions([{ content: 'Continue', action: h.jump('chapter-2') }]);
h.actions([{ content: 'Continue', action: h.jump(chapter2) }]);
```

***

### when()

> **when**: \<`T`\>(`condition`, `value`) => `T` \| `undefined`

Defined in: [packages/core/src/passages/definition.ts:90](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/core/src/passages/definition.ts#L90)

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
