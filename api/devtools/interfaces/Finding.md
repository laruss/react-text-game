# Interface: Finding

Defined in: [types.ts:95](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L95)

One difference between two schemas.

## Properties

### code

> **code**: [`FindingCode`](../type-aliases/FindingCode.md)

Defined in: [types.ts:97](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L97)

See [FindingCode](../type-aliases/FindingCode.md).

***

### message

> **message**: `string`

Defined in: [types.ts:106](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L106)

Human-readable explanation, including why it matters.

***

### severity

> **severity**: [`Severity`](../type-aliases/Severity.md)

Defined in: [types.ts:99](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L99)

See [Severity](../type-aliases/Severity.md).

***

### subject

> **subject**: `string`

Defined in: [types.ts:104](https://github.com/laruss/react-text-game/blob/0d143cb8a19ec7bec1893fbcc47e9d755c567f87/packages/devtools/src/types.ts#L104)

What the finding is about: an entity id, a dotted path, or a passage id.
Empty for findings about the schema as a whole.
