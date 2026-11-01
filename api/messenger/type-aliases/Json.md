# Type Alias: Json

> **Json** = `string` \| `number` \| `boolean` \| `null` \| `Json`[] \| \{\[`key`: `string`\]: `Json`; \}

Defined in: [types.ts:9](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/messenger/src/types.ts#L9)

Any JSON-serializable value.

Everything a chat persists has to survive `JSON.stringify`, because the whole
transcript travels inside the game's save snapshot.
