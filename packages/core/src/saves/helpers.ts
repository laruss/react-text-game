// crypto-js ships no "exports" map, so Node's ESM resolver cannot add the
// extension for us. Spell these subpaths out in full to keep the built package
// importable by Node as well as by bundlers.
import AES from "crypto-js/aes.js";
import WordArray from "crypto-js/core.js";
import Base64 from "crypto-js/enc-base64.js";
import Utf8 from "crypto-js/enc-utf8.js";
import PBKDF2 from "crypto-js/pbkdf2.js";

import { _getOptions } from "#options";

import { ITERATIONS, KEY_SIZE, SAVE_POSTFIX } from "./constants";

/**
 * Generates the encryption password by combining game ID with save postfix
 * @param gameId - Game ID to use instead of the configured one. Lets tooling
 * read a save file without booting the game it belongs to.
 * @returns Password string for encryption/decryption
 */
const getPassword = (gameId?: string) =>
    `${gameId ?? _getOptions().gameId}.${SAVE_POSTFIX}`;

/**
 * Encodes (encrypts) data using AES encryption with PBKDF2 key derivation.
 * The output is a byte array that can be saved to a file.
 *
 * @template T - Type of data to encode
 * @param data - Data to encrypt
 * @param gameId - Game ID to derive the password from. Defaults to the game ID
 * in the current options.
 * @returns Uint8Array containing encrypted data with salt and IV prepended
 */
export const encodeSf = <T>(data: T, gameId?: string) => {
    const salt = WordArray.lib.WordArray.random(128 / 8);
    const key = PBKDF2(getPassword(gameId), salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS,
    });
    const iv = WordArray.lib.WordArray.random(128 / 8);
    const encrypted = AES.encrypt(JSON.stringify(data), key, {
        iv,
    });
    const transitMessage =
        salt.toString(Base64) + iv.toString(Base64) + encrypted.toString();

    return new TextEncoder().encode(transitMessage);
};

/**
 * Decodes (decrypts) data that was encrypted using encodeSf.
 * Extracts salt and IV from the encrypted data and uses them to decrypt.
 *
 * @template T - Expected type of the decrypted data
 * @param data - ArrayBuffer containing encrypted data
 * @param gameId - Game ID to derive the password from. Defaults to the game ID
 * in the current options.
 * @returns Decrypted data of type T
 * @throws Error if decryption fails (corrupted data or password mismatch)
 */
export const decodeSf = <T>(data: ArrayBuffer, gameId?: string): T => {
    const transitMessage = new TextDecoder().decode(data);

    const saltString = transitMessage.substring(0, 24);
    const ivString = transitMessage.substring(24, 48);
    const encryptedString = transitMessage.substring(48);

    const salt = Base64.parse(saltString);
    const iv = Base64.parse(ivString);

    const key = PBKDF2(getPassword(gameId), salt, {
        keySize: KEY_SIZE,
        iterations: ITERATIONS,
    });

    const decrypted = AES.decrypt(encryptedString, key, {
        iv,
    });

    const jsonString = decrypted.toString(Utf8);
    if (!jsonString) {
        throw new Error(
            "Failed to decrypt. Data might be corrupted or the password/logic has changed."
        );
    }

    return JSON.parse(jsonString) as T;
};

/**
 * Formats a Date object into a human-readable string.
 * Format: "DD of MONTH, YYYY HH:MM" (24-hour format)
 *
 * @param timestamp - Date to format
 * @returns Formatted date string (e.g., "15 of January, 2025 14:30")
 */
export const getDateString = (timestamp: Date) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${day} of ${month}, ${year} ${time}`;
};
