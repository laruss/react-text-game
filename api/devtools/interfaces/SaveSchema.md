# Interface: SaveSchema

Defined in: [types.ts:47](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L47)

A comparable description of one version's save shape.

## Properties

### capturedFrom

> **capturedFrom**: [`CaptureSource`](../type-aliases/CaptureSource.md)

Defined in: [types.ts:53](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L53)

See [CaptureSource](../type-aliases/CaptureSource.md).

***

### entities

> **entities**: `string`[]

Defined in: [types.ts:55](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L55)

Sorted ids of every game entity, excluding engine-owned system state.

***

### gameVersion

> **gameVersion**: `string`

Defined in: [types.ts:51](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L51)

Game version this shape belongs to.

***

### passages

> **passages**: `string`[] \| `null`

Defined in: [types.ts:64](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L64)

Sorted ids of every registered passage, or `null` when the capture source
could not know them.

#### Remarks

Only a `code` capture knows the passage registry. Saves and dumps record
just the one id the player was on, so passage checks are skipped for them.

***

### paths

> **paths**: `Record`\<`string`, [`SchemaKind`](../type-aliases/SchemaKind.md)\>

Defined in: [types.ts:66](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L66)

Dotted path to kind, for every node in the state tree, sorted by path.

***

### schemaVersion

> **schemaVersion**: `number`

Defined in: [types.ts:49](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/devtools/src/types.ts#L49)

See [SCHEMA\_VERSION](../variables/SCHEMA_VERSION.md).
