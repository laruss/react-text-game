import type { ChatVars, TranscriptEntry } from "#types";

/**
 * Key of the oldest entry the player has not seen, or `null` when the chat is
 * fully read.
 *
 * @remarks
 * This is the anchor a chat view scrolls to and the point an "unread" divider
 * goes above.
 */
export const selectFirstUnreadKey = (vars: ChatVars): string | null =>
    vars.entries.find((entry) => !entry.seen)?.key ?? null;

/**
 * Newest entry in the transcript, or `null` when it is empty.
 */
export const selectLastEntry = (vars: ChatVars): TranscriptEntry | null =>
    vars.entries.at(-1) ?? null;

/**
 * Entries the player has not seen yet, oldest first.
 */
export const selectUnseenEntries = (vars: ChatVars): Array<TranscriptEntry> =>
    vars.entries.filter((entry) => !entry.seen);

/**
 * Contacts whose typing indicator has not expired at the given game time.
 */
export const selectTypingContacts = (
    vars: ChatVars,
    now: number
): Array<string> =>
    Object.keys(vars.typingUntil).filter(
        (id) => (vars.typingUntil[id] ?? 0) > now
    );

/**
 * Number of entries the player has not seen.
 */
export const selectUnread = (vars: ChatVars): number =>
    vars.entries.reduce((total, entry) => (entry.seen ? total : total + 1), 0);
