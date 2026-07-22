import AES from "crypto-js/aes";
import WordArray from "crypto-js/core";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import PBKDF2 from "crypto-js/pbkdf2";

import { _getOptions } from "#options";

import { ITERATIONS, KEY_SIZE, SAVE_POSTFIX } from "./constants";

/**
 * Generates the encryption password by combining game ID with save postfix
 * @returns Password string for encryption/decryption
 */
const getPassword = () => `${_getOptions().gameId}.${SAVE_POSTFIX}`;

/**
 * Encodes (encrypts) data using AES encryption with PBKDF2 key derivation.
 * The output is a byte array that can be saved to a file.
 *
 * @template T - Type of data to encode
 * @param data - Data to encrypt
 * @returns Uint8Array containing encrypted data with salt and IV prepended
 */
export const encodeSf = <T>(data: T) => {
    const salt = WordArray.lib.WordArray.random(128 / 8);
    const key = PBKDF2(getPassword(), salt, {
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
 * @returns Decrypted data of type T
 * @throws Error if decryption fails (corrupted data or password mismatch)
 */
export const decodeSf = <T>(data: ArrayBuffer): T => {
    const transitMessage = new TextDecoder().decode(data);

    const saltString = transitMessage.substring(0, 24);
    const ivString = transitMessage.substring(24, 48);
    const encryptedString = transitMessage.substring(48);

    const salt = Base64.parse(saltString);
    const iv = Base64.parse(ivString);

    const key = PBKDF2(getPassword(), salt, {
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
