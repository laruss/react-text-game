# Type Alias: SenderScope

> **SenderScope** = `object`

Defined in: [scripts/types.ts:164](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L164)

Builders for messages sent by one particular sender.

## Properties

### custom()

> **custom**: (`name`, `data`, `options?`) => [`CustomBeatInput`](CustomBeatInput.md)

Defined in: [scripts/types.ts:205](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L205)

An author-defined payload, passed through to the UI untouched.

#### Parameters

##### name

`string`

##### data

[`Json`](Json.md)

##### options?

`Pick`\<[`MessageOptions`](MessageOptions.md), `"id"`\>

#### Returns

[`CustomBeatInput`](CustomBeatInput.md)

***

### image()

> **image**: (`src`, `options?`) => [`MessageBeatInput`](MessageBeatInput.md)

Defined in: [scripts/types.ts:193](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L193)

Shorthand for a single-image media message.

#### Parameters

##### src

`string`

##### options?

[`MediaMessageOptions`](MediaMessageOptions.md) & [`MediaItemOptions`](MediaItemOptions.md)

#### Returns

[`MessageBeatInput`](MessageBeatInput.md)

***

### media()

> **media**: (`items`, `options?`) => [`MessageBeatInput`](MessageBeatInput.md)

Defined in: [scripts/types.ts:187](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L187)

A media message. One item is a single photo or video, several make an
album, and `caption` is the comment shown with them.

#### Parameters

##### items

[`MediaItemInput`](MediaItemInput.md)[]

##### options?

[`MediaMessageOptions`](MediaMessageOptions.md)

#### Returns

[`MessageBeatInput`](MessageBeatInput.md)

#### Example

```typescript
m.from(anna).media([m.image("/park.webp")], { caption: m.t("anna.park") })
m.from(anna).media([m.image("/1.webp"), m.video("/2.mp4")])
```

***

### text()

> **text**: (`content`, `options?`) => [`MessageBeatInput`](MessageBeatInput.md)

Defined in: [scripts/types.ts:175](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L175)

A text message.

#### Parameters

##### content

[`TextInput`](TextInput.md)

##### options?

[`MessageOptions`](MessageOptions.md)

#### Returns

[`MessageBeatInput`](MessageBeatInput.md)

#### Example

```typescript
m.from(anna).text("hey, you up?")
m.from(anna).text(m.t("anna.opener"))
m.from(anna).text(<>look at <b>this</b></>)
```

***

### video()

> **video**: (`src`, `options?`) => [`MessageBeatInput`](MessageBeatInput.md)

Defined in: [scripts/types.ts:199](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/messenger/src/scripts/types.ts#L199)

Shorthand for a single-video media message.

#### Parameters

##### src

`string`

##### options?

[`MediaMessageOptions`](MediaMessageOptions.md) & [`MediaItemOptions`](MediaItemOptions.md)

#### Returns

[`MessageBeatInput`](MessageBeatInput.md)
