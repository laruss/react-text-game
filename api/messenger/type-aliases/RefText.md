# Type Alias: RefText

> **RefText** = `object`

Defined in: [types.ts:54](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L54)

A pointer back into the script beat that produced the text.

## Remarks

The only form that can carry a React node, since a node cannot be serialized.
The content is re-read from the script on every render, so anything dynamic
must travel through `params` rather than being interpolated into the node.

## Properties

### beatId

> **beatId**: `string`

Defined in: [types.ts:57](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L57)

***

### kind

> **kind**: `"ref"`

Defined in: [types.ts:55](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L55)

***

### scriptId

> **scriptId**: `string`

Defined in: [types.ts:56](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L56)

***

### slot

> **slot**: `string`

Defined in: [types.ts:59](https://github.com/laruss/react-text-game/blob/415f8c5bf941043d9ac69002f1e57d7da1774219/packages/messenger/src/types.ts#L59)

Which text of the beat this refers to, e.g. `"text"`, `"caption"`, `"alt:0"`.
