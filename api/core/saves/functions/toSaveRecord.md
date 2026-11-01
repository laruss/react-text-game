# Function: toSaveRecord()

> **toSaveRecord**(`value`): [`GameSave`](../interfaces/GameSave.md) \| `null`

Defined in: [packages/core/src/saves/records.ts:68](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/saves/records.ts#L68)

Reads an unknown value as a save record, normalizing legacy field names.

## Parameters

### value

`unknown`

Candidate record, typically straight out of a decoded file

## Returns

[`GameSave`](../interfaces/GameSave.md) \| `null`

A normalized copy, or `null` if the value cannot be a save
