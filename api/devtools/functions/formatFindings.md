# Function: formatFindings()

> **formatFindings**(`findings`): `string`

Defined in: [report.ts:15](https://github.com/laruss/react-text-game/blob/7b0de9d1745a4d5d61bf751fa93c904f39754886/packages/devtools/src/report.ts#L15)

Renders findings as an indented, severity-tagged list.

## Parameters

### findings

[`Finding`](../interfaces/Finding.md)[]

Findings to render, already ordered

## Returns

`string`

Printable text, or a single line when there is nothing to report
