# Function: encodeSf()

> **encodeSf**\<`T`\>(`data`, `gameId?`): `Uint8Array`\<`ArrayBuffer`\>

Defined in: [packages/core/src/saves/helpers.ts:33](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/core/src/saves/helpers.ts#L33)

Encodes (encrypts) data using AES encryption with PBKDF2 key derivation.
The output is a byte array that can be saved to a file.

## Type Parameters

### T

`T`

Type of data to encode

## Parameters

### data

`T`

Data to encrypt

### gameId?

`string`

Game ID to derive the password from. Defaults to the game ID
in the current options.

## Returns

`Uint8Array`\<`ArrayBuffer`\>

Uint8Array containing encrypted data with salt and IV prepended
