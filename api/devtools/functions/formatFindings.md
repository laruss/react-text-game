# Function: formatFindings()

> **formatFindings**(`findings`): `string`

Defined in: [report.ts:15](https://github.com/laruss/react-text-game/blob/423d8d0db749bd837c975abed775d8768670d2b3/packages/devtools/src/report.ts#L15)

Renders findings as an indented, severity-tagged list.

## Parameters

### findings

[`Finding`](../interfaces/Finding.md)[]

Findings to render, already ordered

## Returns

`string`

Printable text, or a single line when there is nothing to report
