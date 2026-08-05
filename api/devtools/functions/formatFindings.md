# Function: formatFindings()

> **formatFindings**(`findings`): `string`

Defined in: [report.ts:15](https://github.com/laruss/react-text-game/blob/7afdceba63b91ff6ce8e4983ca24c5de0550b15f/packages/devtools/src/report.ts#L15)

Renders findings as an indented, severity-tagged list.

## Parameters

### findings

[`Finding`](../interfaces/Finding.md)[]

Findings to render, already ordered

## Returns

`string`

Printable text, or a single line when there is nothing to report
