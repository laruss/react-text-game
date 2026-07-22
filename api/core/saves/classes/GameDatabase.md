# Class: GameDatabase

Defined in: [packages/core/src/saves/db.ts:17](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/db.ts#L17)

Dexie database class for managing game saves and settings.
Uses IndexedDB for browser-based persistent storage.

## Extends

- `Dexie`

## Constructors

### Constructor

> **new GameDatabase**(`gameId`): `GameDatabase`

Defined in: [packages/core/src/saves/db.ts:27](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/db.ts#L27)

Creates a new GameDatabase instance

#### Parameters

##### gameId

`string`

Unique identifier for the game, used as database name prefix

#### Returns

`GameDatabase`

#### Overrides

`Dexie.constructor`

## Properties

### \_allTables

> `readonly` **\_allTables**: `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:845

#### Index Signature

\[`name`: `string`\]: `Table`\<`any`, `IndexableType`, `any`\>

#### Inherited from

`Dexie._allTables`

***

### \_createTransaction()

> **\_createTransaction**: (`this`, `mode`, `storeNames`, `dbschema`, `parentTransaction?`) => `Transaction`

Defined in: node\_modules/dexie/dist/dexie.d.ts:850

#### Parameters

##### this

`Dexie`

##### mode

`IDBTransactionMode`

##### storeNames

`ArrayLike`\<`string`\>

##### dbschema

`DbSchema`

##### parentTransaction?

`Transaction` | `null`

#### Returns

`Transaction`

#### Inherited from

`Dexie._createTransaction`

***

### \_dbSchema

> **\_dbSchema**: `DbSchema`

Defined in: node\_modules/dexie/dist/dexie.d.ts:852

#### Inherited from

`Dexie._dbSchema`

***

### \_novip

> `readonly` **\_novip**: `Dexie`

Defined in: node\_modules/dexie/dist/dexie.d.ts:851

#### Inherited from

`Dexie._novip`

***

### \_options

> `readonly` **\_options**: `DexieOptions`

Defined in: node\_modules/dexie/dist/dexie.d.ts:848

#### Inherited from

`Dexie._options`

***

### Collection

> **Collection**: `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:898

#### prototype

> **prototype**: `Collection`

#### Inherited from

`Dexie.Collection`

***

### core

> `readonly` **core**: `DBCore`

Defined in: node\_modules/dexie/dist/dexie.d.ts:849

#### Inherited from

`Dexie.core`

***

### name

> `readonly` **name**: `string`

Defined in: node\_modules/dexie/dist/dexie.d.ts:841

#### Inherited from

`Dexie.name`

***

### on

> **on**: `DbEvents`

Defined in: node\_modules/dexie/dist/dexie.d.ts:854

#### Inherited from

`Dexie.on`

***

### once

> **once**: `DbEventFns`

Defined in: node\_modules/dexie/dist/dexie.d.ts:855

#### Inherited from

`Dexie.once`

***

### saves

> **saves**: `EntityTable`\<[`GameSave`](../interfaces/GameSave.md), `"id"`\>

Defined in: [packages/core/src/saves/db.ts:19](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/db.ts#L19)

Table for storing game saves

***

### settings

> **settings**: `EntityTable`\<[`GameSettings`](../interfaces/GameSettings.md), `"id"`\>

Defined in: [packages/core/src/saves/db.ts:21](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/saves/db.ts#L21)

Table for storing game settings

***

### Table

> **Table**: `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:886

#### prototype

> **prototype**: `Table`

#### Inherited from

`Dexie.Table`

***

### tables

> `readonly` **tables**: `Table`\<`any`, `any`, `any`\>[]

Defined in: node\_modules/dexie/dist/dexie.d.ts:842

#### Inherited from

`Dexie.tables`

***

### Transaction

> **Transaction**: `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:895

#### prototype

> **prototype**: `Transaction`

#### Inherited from

`Dexie.Transaction`

***

### verno

> `readonly` **verno**: `number`

Defined in: node\_modules/dexie/dist/dexie.d.ts:843

#### Inherited from

`Dexie.verno`

***

### Version

> **Version**: `Function` & `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:892

#### Type Declaration

##### prototype

> **prototype**: `ExtendableVersion`

#### Inherited from

`Dexie.Version`

***

### vip

> `readonly` **vip**: `Dexie`

Defined in: node\_modules/dexie/dist/dexie.d.ts:844

#### Inherited from

`Dexie.vip`

***

### WhereClause

> **WhereClause**: `object`

Defined in: node\_modules/dexie/dist/dexie.d.ts:889

#### prototype

> **prototype**: `WhereClause`

#### Inherited from

`Dexie.WhereClause`

***

### AbortError

> `static` **AbortError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.AbortError`

***

### addons

> `static` **addons**: (`db`) => `void`[]

Defined in: node\_modules/dexie/dist/dexie.d.ts:1128

#### Parameters

##### db

`Dexie`

#### Returns

`void`

#### Inherited from

`Dexie.addons`

***

### BulkError

> `static` **BulkError**: `BulkErrorConstructor`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1036

#### Inherited from

`Dexie.BulkError`

***

### cache

> `static` **cache**: `GlobalQueryCache`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1153

#### Inherited from

`Dexie.cache`

***

### ConstraintError

> `static` **ConstraintError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.ConstraintError`

***

### currentTransaction

> `static` **currentTransaction**: `Transaction`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1131

#### Inherited from

`Dexie.currentTransaction`

***

### DatabaseClosedError

> `static` **DatabaseClosedError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.DatabaseClosedError`

***

### DataCloneError

> `static` **DataCloneError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.DataCloneError`

***

### DataError

> `static` **DataError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.DataError`

***

### debug

> `static` **debug**: `boolean` \| `"dexie"`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1154

#### Inherited from

`Dexie.debug`

***

### default

> `static` **default**: `Dexie`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1152

#### Inherited from

`Dexie.default`

***

### dependencies

> `static` **dependencies**: `DexieDOMDependencies`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1151

#### Inherited from

`Dexie.dependencies`

***

### DexieError

> `static` **DexieError**: `DexieErrorConstructor`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1034

#### Inherited from

`Dexie.DexieError`

***

### disableBfCache?

> `static` `optional` **disableBfCache**: `boolean`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1137

#### Inherited from

`Dexie.disableBfCache`

***

### errnames

> `static` **errnames**: `DexieErrors`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1160

#### Inherited from

`Dexie.errnames`

***

### Events()

> `static` **Events**: (`ctx?`) => `DexieEventSet`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1158

#### Parameters

##### ctx?

`any`

#### Returns

`DexieEventSet`

#### Inherited from

`Dexie.Events`

***

### ForeignAwaitError

> `static` **ForeignAwaitError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.ForeignAwaitError`

***

### InternalError

> `static` **InternalError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.InternalError`

***

### InvalidAccessError

> `static` **InvalidAccessError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.InvalidAccessError`

***

### InvalidArgumentError

> `static` **InvalidArgumentError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.InvalidArgumentError`

***

### InvalidStateError

> `static` **InvalidStateError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.InvalidStateError`

***

### InvalidTableError

> `static` **InvalidTableError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.InvalidTableError`

***

### maxKey

> `static` **maxKey**: `string` \| `void`[][]

Defined in: node\_modules/dexie/dist/dexie.d.ts:1147

#### Inherited from

`Dexie.maxKey`

***

### minKey

> `static` **minKey**: `number`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1148

#### Inherited from

`Dexie.minKey`

***

### MissingAPIError

> `static` **MissingAPIError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.MissingAPIError`

***

### ModifyError

> `static` **ModifyError**: `ModifyErrorConstructor`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1035

#### Inherited from

`Dexie.ModifyError`

***

### NoSuchDatabaseError

> `static` **NoSuchDatabaseError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.NoSuchDatabaseError`

***

### NotFoundError

> `static` **NotFoundError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.NotFoundError`

***

### on

> `static` **on**: `GlobalDexieEvents`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1159

#### Inherited from

`Dexie.on`

***

### OpenFailedError

> `static` **OpenFailedError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.OpenFailedError`

***

### PrematureCommitError

> `static` **PrematureCommitError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.PrematureCommitError`

***

### Promise

> `static` **Promise**: `PromiseExtendedConstructor`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1155

#### Inherited from

`Dexie.Promise`

***

### QuotaExceededError

> `static` **QuotaExceededError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.QuotaExceededError`

***

### ReadOnlyError

> `static` **ReadOnlyError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.ReadOnlyError`

***

### SchemaError

> `static` **SchemaError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.SchemaError`

***

### semVer

> `static` **semVer**: `string`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1130

#### Inherited from

`Dexie.semVer`

***

### SubTransactionError

> `static` **SubTransactionError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.SubTransactionError`

***

### TimeoutError

> `static` **TimeoutError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.TimeoutError`

***

### TransactionInactiveError

> `static` **TransactionInactiveError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.TransactionInactiveError`

***

### UnknownError

> `static` **UnknownError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.UnknownError`

***

### UnsupportedError

> `static` **UnsupportedError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.UnsupportedError`

***

### UpgradeError

> `static` **UpgradeError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.UpgradeError`

***

### version

> `static` **version**: `number`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1129

#### Inherited from

`Dexie.version`

***

### VersionChangeError

> `static` **VersionChangeError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.VersionChangeError`

***

### VersionError

> `static` **VersionError**: `DexieErrorConstructor`

#### Inherited from

`Dexie.VersionError`

## Methods

### backendDB()

> **backendDB**(): `IDBDatabase`

Defined in: node\_modules/dexie/dist/dexie.d.ts:874

#### Returns

`IDBDatabase`

#### Inherited from

`Dexie.backendDB`

***

### close()

> **close**(`closeOptions?`): `void`

Defined in: node\_modules/dexie/dist/dexie.d.ts:864

#### Parameters

##### closeOptions?

###### disableAutoOpen

`boolean`

#### Returns

`void`

#### Inherited from

`Dexie.close`

***

### delete()

> **delete**(`closeOptions?`): `PromiseExtended`\<`void`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:867

#### Parameters

##### closeOptions?

###### disableAutoOpen

`boolean`

#### Returns

`PromiseExtended`\<`void`\>

#### Inherited from

`Dexie.delete`

***

### dynamicallyOpened()

> **dynamicallyOpened**(): `boolean`

Defined in: node\_modules/dexie/dist/dexie.d.ts:873

#### Returns

`boolean`

#### Inherited from

`Dexie.dynamicallyOpened`

***

### hasBeenClosed()

> **hasBeenClosed**(): `boolean`

Defined in: node\_modules/dexie/dist/dexie.d.ts:871

#### Returns

`boolean`

#### Inherited from

`Dexie.hasBeenClosed`

***

### hasFailed()

> **hasFailed**(): `boolean`

Defined in: node\_modules/dexie/dist/dexie.d.ts:872

#### Returns

`boolean`

#### Inherited from

`Dexie.hasFailed`

***

### isOpen()

> **isOpen**(): `boolean`

Defined in: node\_modules/dexie/dist/dexie.d.ts:870

#### Returns

`boolean`

#### Inherited from

`Dexie.isOpen`

***

### open()

> **open**(): `PromiseExtended`\<`Dexie`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:856

#### Returns

`PromiseExtended`\<`Dexie`\>

#### Inherited from

`Dexie.open`

***

### table()

> **table**\<`T`, `TKey`, `TInsertType`\>(`tableName`): `Table`\<`T`, `TKey`, `TInsertType`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:857

#### Type Parameters

##### T

`T` = `any`

##### TKey

`TKey` = `IndexableType`

##### TInsertType

`TInsertType` = `T`

#### Parameters

##### tableName

`string`

#### Returns

`Table`\<`T`, `TKey`, `TInsertType`\>

#### Inherited from

`Dexie.table`

***

### transaction()

#### Call Signature

> **transaction**\<`U`\>(`mode`, `tables`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:858

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### tables

readonly (`string` \| `Table`\<`any`, `any`, `any`\>)[]

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

#### Call Signature

> **transaction**\<`U`\>(`mode`, `table`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:859

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### table

`string` | `Table`\<`any`, `any`, `any`\>

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

#### Call Signature

> **transaction**\<`U`\>(`mode`, `table`, `table2`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:860

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### table

`string` | `Table`\<`any`, `any`, `any`\>

###### table2

`string` | `Table`\<`any`, `any`, `any`\>

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

#### Call Signature

> **transaction**\<`U`\>(`mode`, `table`, `table2`, `table3`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:861

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### table

`string` | `Table`\<`any`, `any`, `any`\>

###### table2

`string` | `Table`\<`any`, `any`, `any`\>

###### table3

`string` | `Table`\<`any`, `any`, `any`\>

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

#### Call Signature

> **transaction**\<`U`\>(`mode`, `table`, `table2`, `table3`, `table4`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:862

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### table

`string` | `Table`\<`any`, `any`, `any`\>

###### table2

`string` | `Table`\<`any`, `any`, `any`\>

###### table3

`string` | `Table`\<`any`, `any`, `any`\>

###### table4

`string` | `Table`\<`any`, `any`, `any`\>

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

#### Call Signature

> **transaction**\<`U`\>(`mode`, `table`, `table2`, `table3`, `table4`, `table5`, `scope`): `PromiseExtended`\<`U`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:863

##### Type Parameters

###### U

`U`

##### Parameters

###### mode

`TransactionMode`

###### table

`string` | `Table`\<`any`, `any`, `any`\>

###### table2

`string` | `Table`\<`any`, `any`, `any`\>

###### table3

`string` | `Table`\<`any`, `any`, `any`\>

###### table4

`string` | `Table`\<`any`, `any`, `any`\>

###### table5

`string` | `Table`\<`any`, `any`, `any`\>

###### scope

(`trans`) => `U` \| `PromiseLike`\<`U`\>

##### Returns

`PromiseExtended`\<`U`\>

##### Inherited from

`Dexie.transaction`

***

### unuse()

#### Call Signature

> **unuse**(`__namedParameters`): `this`

Defined in: node\_modules/dexie/dist/dexie.d.ts:877

##### Parameters

###### \_\_namedParameters

`Middleware`\<\{ `stack`: `"dbcore"`; \}\>

##### Returns

`this`

##### Inherited from

`Dexie.unuse`

#### Call Signature

> **unuse**(`__namedParameters`): `this`

Defined in: node\_modules/dexie/dist/dexie.d.ts:880

##### Parameters

###### \_\_namedParameters

###### name

`string`

###### stack

`"dbcore"`

##### Returns

`this`

##### Inherited from

`Dexie.unuse`

***

### use()

> **use**(`middleware`): `this`

Defined in: node\_modules/dexie/dist/dexie.d.ts:875

#### Parameters

##### middleware

`Middleware`\<`DBCore`\>

#### Returns

`this`

#### Inherited from

`Dexie.use`

***

### version()

> **version**(`versionNumber`): `Version`

Defined in: node\_modules/dexie/dist/dexie.d.ts:853

#### Parameters

##### versionNumber

`number`

#### Returns

`Version`

#### Inherited from

`Dexie.version`

***

### asap()

> `static` **asap**(`fn`): `void`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1146

#### Parameters

##### fn

`Function`

#### Returns

`void`

#### Inherited from

`Dexie.asap`

***

### deepClone()

> `static` **deepClone**\<`T`\>(`obj`): `T`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1145

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

#### Inherited from

`Dexie.deepClone`

***

### delByKeyPath()

> `static` **delByKeyPath**(`obj`, `keyPath`): `void`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1143

#### Parameters

##### obj

`Object`

##### keyPath

`string` | `string`[]

#### Returns

`void`

#### Inherited from

`Dexie.delByKeyPath`

***

### delete()

> `static` **delete**(`dbName`): `Promise`\<`void`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1150

#### Parameters

##### dbName

`string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`Dexie.delete`

***

### exists()

> `static` **exists**(`dbName`): `Promise`\<`boolean`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1149

#### Parameters

##### dbName

`string`

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

`Dexie.exists`

***

### extendObservabilitySet()

> `static` **extendObservabilitySet**(`target`, `newSet`): `ObservabilitySet`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1139

#### Parameters

##### target

`ObservabilitySet`

##### newSet

`ObservabilitySet`

#### Returns

`ObservabilitySet`

#### Inherited from

`Dexie.extendObservabilitySet`

***

### getByKeyPath()

> `static` **getByKeyPath**(`obj`, `keyPath`): `any`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1141

#### Parameters

##### obj

`Object`

##### keyPath

`string` | `string`[]

#### Returns

`any`

#### Inherited from

`Dexie.getByKeyPath`

***

### getDatabaseNames()

#### Call Signature

> `static` **getDatabaseNames**(): `Promise`\<`string`[]\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1133

##### Returns

`Promise`\<`string`[]\>

##### Inherited from

`Dexie.getDatabaseNames`

#### Call Signature

> `static` **getDatabaseNames**\<`R`\>(`thenShortcut`): `Promise`\<`R`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1134

##### Type Parameters

###### R

`R`

##### Parameters

###### thenShortcut

`ThenShortcut`\<`string`[], `R`\>

##### Returns

`Promise`\<`R`\>

##### Inherited from

`Dexie.getDatabaseNames`

***

### ignoreTransaction()

> `static` **ignoreTransaction**\<`U`\>(`fn`): `U`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1136

#### Type Parameters

##### U

`U`

#### Parameters

##### fn

() => `U`

#### Returns

`U`

#### Inherited from

`Dexie.ignoreTransaction`

***

### liveQuery()

> `static` **liveQuery**\<`T`\>(`fn`): `Observable`\<`T`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1138

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `T` \| `Promise`\<`T`\>

#### Returns

`Observable`\<`T`\>

#### Inherited from

`Dexie.liveQuery`

***

### override()

> `static` **override**\<`F`\>(`origFunc`, `overridedFactory`): `F`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1140

#### Type Parameters

##### F

`F`

#### Parameters

##### origFunc

`F`

##### overridedFactory

(`fn`) => `any`

#### Returns

`F`

#### Inherited from

`Dexie.override`

***

### setByKeyPath()

> `static` **setByKeyPath**(`obj`, `keyPath`, `value`): `void`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1142

#### Parameters

##### obj

`Object`

##### keyPath

`string` | `string`[]

##### value

`any`

#### Returns

`void`

#### Inherited from

`Dexie.setByKeyPath`

***

### shallowClone()

> `static` **shallowClone**\<`T`\>(`obj`): `T`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1144

#### Type Parameters

##### T

`T`

#### Parameters

##### obj

`T`

#### Returns

`T`

#### Inherited from

`Dexie.shallowClone`

***

### vip()

> `static` **vip**\<`U`\>(`scopeFunction`): `U`

Defined in: node\_modules/dexie/dist/dexie.d.ts:1135

#### Type Parameters

##### U

`U`

#### Parameters

##### scopeFunction

() => `U`

#### Returns

`U`

#### Inherited from

`Dexie.vip`

***

### waitFor()

> `static` **waitFor**\<`T`\>(`promise`, `timeoutMilliseconds?`): `Promise`\<`T`\>

Defined in: node\_modules/dexie/dist/dexie.d.ts:1132

#### Type Parameters

##### T

`T`

#### Parameters

##### promise

`T` | `PromiseLike`\<`T`\>

##### timeoutMilliseconds?

`number`

#### Returns

`Promise`\<`T`\>

#### Inherited from

`Dexie.waitFor`
