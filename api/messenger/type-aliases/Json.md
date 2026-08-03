# Type Alias: Json

> **Json** = `string` \| `number` \| `boolean` \| `null` \| `Json`[] \| \{\[`key`: `string`\]: `Json`; \}

Defined in: [types.ts:9](https://github.com/laruss/react-text-game/blob/2feaccf7cc721dee02f37759df31ed424b0f0e17/packages/messenger/src/types.ts#L9)

Any JSON-serializable value.

Everything a chat persists has to survive `JSON.stringify`, because the whole
transcript travels inside the game's save snapshot.
