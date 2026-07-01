# Interface: MigrationOptions

Defined in: [packages/core/src/saves/migrations/types.ts:184](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L184)

Options for migration behavior

## Properties

### strict?

> `optional` **strict**: `boolean`

Defined in: [packages/core/src/saves/migrations/types.ts:190](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L190)

Whether to throw an error if no migration path is found.
If false, returns the original data unchanged.

#### Default

```ts
false
```

***

### verbose?

> `optional` **verbose**: `boolean`

Defined in: [packages/core/src/saves/migrations/types.ts:196](https://github.com/laruss/react-text-game/blob/a8945b21c86c79db7af71fbb39acd862002dd8a4/packages/core/src/saves/migrations/types.ts#L196)

Whether to log migration steps for debugging.

#### Default

```ts
true in dev mode, false in production
```
