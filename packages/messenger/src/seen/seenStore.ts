import { getSetting, setSetting } from "@react-text-game/core/saves";

import { SEEN_FLUSH_DEBOUNCE_MS, SEEN_SETTING_KEY } from "#constants";
import { logger } from "#logger";
import type { SeenStore } from "#types";

/**
 * Where a {@link SeenStore} keeps its data.
 *
 * Injectable so the default store can be tested without a database, and so a
 * game can persist the record somewhere else entirely.
 */
export type SeenTransport = {
    read(): Promise<Array<string>>;
    write(beatIds: Array<string>): Promise<void>;
};

/**
 * Persists the seen record in the engine's settings table.
 *
 * @remarks
 * Deliberately outside the save snapshot: "has the player ever read this" has to
 * outlive a single save slot, which is what makes skip-already-read, galleries,
 * and unlocked-ending screens possible.
 */
export const settingsSeenTransport: SeenTransport = {
    read: () => getSetting<Array<string>>(SEEN_SETTING_KEY, []),
    write: (beatIds) => setSetting(SEEN_SETTING_KEY, beatIds).then(() => {}),
};

/**
 * Creates the default cross-save seen store.
 *
 * Reads are synchronous from an in-memory set; writes are debounced, because a
 * burst of delivered messages should not mean a burst of database writes.
 *
 * @param transport - Where to persist the record. Defaults to the settings table.
 *
 * @example
 * ```typescript
 * const messenger = defineMessenger();
 * await messenger.loadSeen();      // during bootstrap
 * await messenger.flushSeen();     // before the tab closes
 * ```
 */
export const createSeenStore = (
    transport: SeenTransport = settingsSeenTransport
): SeenStore => {
    const seen = new Set<string>();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const cancelTimer = (): void => {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const write = async (): Promise<void> => {
        await transport.write(Array.from(seen));
    };

    return {
        has: (beatId) => seen.has(beatId),

        add: (beatId) => {
            if (seen.has(beatId)) {
                return;
            }

            seen.add(beatId);
            cancelTimer();

            timer = setTimeout(() => {
                timer = null;
                write().catch((error: unknown) => {
                    logger.error("Failed to persist the seen record.", error);
                });
            }, SEEN_FLUSH_DEBOUNCE_MS);
        },

        load: async () => {
            const stored = await transport.read();

            for (const beatId of stored) {
                seen.add(beatId);
            }
        },

        flush: async () => {
            cancelTimer();
            await write();
        },
    };
};

/**
 * Creates a seen store that never persists.
 *
 * Useful for a game that has no use for cross-save tracking, and for tests.
 *
 * @example
 * ```typescript
 * defineMessenger({ seenStore: createMemorySeenStore() });
 * ```
 */
export const createMemorySeenStore = (): SeenStore => {
    const seen = new Set<string>();

    return {
        has: (beatId) => seen.has(beatId),
        add: (beatId) => {
            seen.add(beatId);
        },
        load: () => Promise.resolve(),
        flush: () => Promise.resolve(),
    };
};
