# Type Alias: Json

> **Json** = `string` \| `number` \| `boolean` \| `null` \| `Json`[] \| \{\[`key`: `string`\]: `Json`; \}

Defined in: [types.ts:9](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/messenger/src/types.ts#L9)

Any JSON-serializable value.

Everything a chat persists has to survive `JSON.stringify`, because the whole
transcript travels inside the game's save snapshot.
