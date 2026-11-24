# Function: toSaveRecord()

> **toSaveRecord**(`value`): [`GameSave`](../interfaces/GameSave.md) \| `null`

Defined in: [packages/core/src/saves/records.ts:68](https://github.com/laruss/react-text-game/blob/eec26bc9ed999238cfd09c6ed359f08cfbe32a5d/packages/core/src/saves/records.ts#L68)

Reads an unknown value as a save record, normalizing legacy field names.

## Parameters

### value

`unknown`

Candidate record, typically straight out of a decoded file

## Returns

[`GameSave`](../interfaces/GameSave.md) \| `null`

A normalized copy, or `null` if the value cannot be a save
