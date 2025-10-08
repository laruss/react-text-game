/**
 * File extension used for encrypted save files
 */
export const SAFE_FILE_EXTENSION = ".sx";

/**
 * Postfix appended to game ID when generating encryption passwords
 */
export const SAVE_POSTFIX = "txt-game";

/**
 * Key size in words (256 bits / 32 bits per word = 8 words) for AES encryption
 */
export const KEY_SIZE = 256 / 32;

/**
 * Number of iterations for PBKDF2 key derivation function
 */
export const ITERATIONS = 1000;
