# Function: decodeSf()

> **decodeSf**\<`T`\>(`data`, `gameId?`): `T`

Defined in: [packages/core/src/saves/helpers.ts:60](https://github.com/laruss/react-text-game/blob/37ebb1fd49045bfbb1d2a2fa96b8f14a2f8c2644/packages/core/src/saves/helpers.ts#L60)

Decodes (decrypts) data that was encrypted using encodeSf.
Extracts salt and IV from the encrypted data and uses them to decrypt.

## Type Parameters

### T

`T`

Expected type of the decrypted data

## Parameters

### data

`ArrayBuffer`

ArrayBuffer containing encrypted data

### gameId?

`string`

Game ID to derive the password from. Defaults to the game ID
in the current options.

## Returns

`T`

Decrypted data of type T

## Throws

Error if decryption fails (corrupted data or password mismatch)
