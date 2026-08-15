# Saves & Migrations

## Classes

- [GameDatabase](classes/GameDatabase.md)

## Interfaces

- [GameSave](interfaces/GameSave.md)
- [GameSettings](interfaces/GameSettings.md)
- [MigrationOptions](interfaces/MigrationOptions.md)
- [MigrationResult](interfaces/MigrationResult.md)
- [SaveMigration](interfaces/SaveMigration.md)

## Type Aliases

- [ReadSaveFileResult](type-aliases/ReadSaveFileResult.md)
- [SaveErrorCode](type-aliases/SaveErrorCode.md)
- [SaveMigrationFn](type-aliases/SaveMigrationFn.md)
- [SaveOptions](type-aliases/SaveOptions.md)
- [SaveResult](type-aliases/SaveResult.md)
- [SaveSlot](type-aliases/SaveSlot.md)
- [SaveSlotsData](type-aliases/SaveSlotsData.md)
- [SaveUpdate](type-aliases/SaveUpdate.md)
- [WriteSavesMode](type-aliases/WriteSavesMode.md)
- [WriteSavesResult](type-aliases/WriteSavesResult.md)

## Variables

- [db](variables/db.md)
- [LEGACY\_DATABASE\_NAME](variables/LEGACY_DATABASE_NAME.md)
- [LEGACY\_MIGRATION\_SETTING](variables/LEGACY_MIGRATION_SETTING.md)
- [SYSTEM\_SAVE\_NAME](variables/SYSTEM_SAVE_NAME.md)

## Functions

- [clearMigrations](functions/clearMigrations.md)
- [createOrUpdateSystemSave](functions/createOrUpdateSystemSave.md)
- [decodeSf](functions/decodeSf.md)
- [deleteAllGameSaves](functions/deleteAllGameSaves.md)
- [deleteSave](functions/deleteSave.md)
- [deleteSetting](functions/deleteSetting.md)
- [encodeSf](functions/encodeSf.md)
- [findMigrationPath](functions/findMigrationPath.md)
- [getAllMigrations](functions/getAllMigrations.md)
- [getAllSaves](functions/getAllSaves.md)
- [getAllSettings](functions/getAllSettings.md)
- [getDatabase](functions/getDatabase.md)
- [getGameDatabase](functions/getGameDatabase.md)
- [getSetting](functions/getSetting.md)
- [getSystemSave](functions/getSystemSave.md)
- [loadGame](functions/loadGame.md)
- [loadGameBySlot](functions/loadGameBySlot.md)
- [loadGameIntoState](functions/loadGameIntoState.md)
- [migrateLegacySaves](functions/migrateLegacySaves.md)
- [migrateToCurrentVersion](functions/migrateToCurrentVersion.md)
- [putSaves](functions/putSaves.md)
- [registerMigration](functions/registerMigration.md)
- [runMigrations](functions/runMigrations.md)
- [saveGame](functions/saveGame.md)
- [setSetting](functions/setSetting.md)
- [toSaveRecord](functions/toSaveRecord.md)
- [updateSave](functions/updateSave.md)
- [useDeleteAllSaves](functions/useDeleteAllSaves.md)
- [useDeleteGame](functions/useDeleteGame.md)
- [useExportSaves](functions/useExportSaves.md)
- [useImportSaves](functions/useImportSaves.md)
- [useLastLoadGame](functions/useLastLoadGame.md)
- [useLoadGame](functions/useLoadGame.md)
- [useReadSaveFile](functions/useReadSaveFile.md)
- [useRestartGame](functions/useRestartGame.md)
- [useSaveGame](functions/useSaveGame.md)
- [useSaveSlots](functions/useSaveSlots.md)
- [useUpdateSave](functions/useUpdateSave.md)
- [useWriteSaves](functions/useWriteSaves.md)
- [validateMigrations](functions/validateMigrations.md)
