# Function: toSaveRecord()

> **toSaveRecord**(`value`): [`GameSave`](../interfaces/GameSave.md) \| `null`

Defined in: [packages/core/src/saves/records.ts:68](https://github.com/laruss/react-text-game/blob/ed8cf48740aa02a9a967fcd73e3ff84f36e6c837/packages/core/src/saves/records.ts#L68)

Reads an unknown value as a save record, normalizing legacy field names.

## Parameters

### value

`unknown`

Candidate record, typically straight out of a decoded file

## Returns

[`GameSave`](../interfaces/GameSave.md) \| `null`

A normalized copy, or `null` if the value cannot be a save
