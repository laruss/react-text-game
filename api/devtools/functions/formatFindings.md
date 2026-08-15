# Function: formatFindings()

> **formatFindings**(`findings`): `string`

Defined in: [report.ts:15](https://github.com/laruss/react-text-game/blob/1ff7cc12f6153268e252c2e249777b24bc45408e/packages/devtools/src/report.ts#L15)

Renders findings as an indented, severity-tagged list.

## Parameters

### findings

[`Finding`](../interfaces/Finding.md)[]

Findings to render, already ordered

## Returns

`string`

Printable text, or a single line when there is nothing to report
