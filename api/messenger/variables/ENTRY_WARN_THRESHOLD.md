# Variable: ENTRY\_WARN\_THRESHOLD

> `const` **ENTRY\_WARN\_THRESHOLD**: `1000` = `1000`

Defined in: [constants.ts:53](https://github.com/laruss/react-text-game/blob/1ccfff1d3271b87953efc0736e0001c41b54aeae/packages/messenger/src/constants.ts#L53)

Entry count after which a chat warns about an unbounded transcript.

## Remarks

Transcripts are uncapped by default so history is never silently lost. The
warning exists because the engine serializes the whole state tree into
`sessionStorage` on every auto-save; set `maxEntries` on the chat once a
transcript gets long.
