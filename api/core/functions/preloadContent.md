# Function: preloadContent()

> **preloadContent**(`assets`, `options`): `Promise`\<`Readonly`\<\{ `completed`: `number`; `failed`: `number`; `failures`: readonly `Readonly`\<\{ `asset`: [`PreloadAsset`](../type-aliases/PreloadAsset.md); `error`: `unknown`; \}\>[]; `succeeded`: `number`; `total`: `number`; \}\>\>

Defined in: [packages/core/src/preload.ts:204](https://github.com/laruss/react-text-game/blob/302fa8835a5795482d8fc01ee44cbc4b943bb88f/packages/core/src/preload.ts#L204)

Preloads and fully consumes a list of game assets with bounded concurrency.
Duplicate sources are loaded once, individual failures are collected, and an
aborted signal rejects the operation immediately.

## Parameters

### assets

readonly [`PreloadAsset`](../type-aliases/PreloadAsset.md)[]

### options

[`PreloadOptions`](../type-aliases/PreloadOptions.md) = `{}`

## Returns

`Promise`\<`Readonly`\<\{ `completed`: `number`; `failed`: `number`; `failures`: readonly `Readonly`\<\{ `asset`: [`PreloadAsset`](../type-aliases/PreloadAsset.md); `error`: `unknown`; \}\>[]; `succeeded`: `number`; `total`: `number`; \}\>\>
