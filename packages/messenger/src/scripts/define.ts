import type { ReactNode } from "react";

import { logger } from "#logger";

import { m } from "./builder";
import type { Beat, Script, ScriptBuilder } from "./types";

const scripts = new Map<string, Script>();

/**
 * Defines an addressable sequence of beats for a chat.
 *
 * @param id - Unique, persistent identifier. It ends up inside saved transcripts,
 * so treat it like a passage id and never rename it once a game has shipped.
 * @param build - Callback returning the beats, given the {@link m} toolbox
 * @returns The script, ready to hand to `chat.play()`
 * @throws Error if the id is already taken
 *
 * @remarks
 * The callback runs whenever the engine needs the beats - when the cursor
 * advances and when a text reference is resolved - so read game state freely but
 * never mutate it there. Falsy entries are skipped, and the position a beat is
 * written at determines its default id, so a conditional beat never shifts the
 * ids of the beats after it.
 *
 * @example
 * ```typescript
 * import { defineScript } from '@react-text-game/messenger';
 *
 * export const opener = defineScript('anna/opener', (m) => [
 *   m.from(anna).text(m.t('anna.opener.1')),
 *   m.typing(anna, 1200),
 *   m.from(anna).media([m.image('/park.webp')], { caption: m.t('anna.park') }),
 *   player.knowsBoris && m.from(anna).text(m.t('anna.aboutBoris')),
 *   m.wait(30 * MINUTE),
 *   m.choice('anna/opener/reply', [
 *     { content: m.t('reply.yes'), next: acceptBranch },
 *     { content: m.t('reply.no') },
 *   ]),
 * ]);
 * ```
 */
export const defineScript = (id: string, build: ScriptBuilder): Script => {
    if (scripts.has(id)) {
        throw new Error(`Script "${id}" is already defined.`);
    }

    const script: Script = { id, build };
    scripts.set(id, script);

    return script;
};

/**
 * Looks up a defined script.
 */
export const getScript = (id: string): Script | undefined => scripts.get(id);

/**
 * Resolves a script's beats, keeping the array positions as written.
 *
 * Falsy entries become `null` rather than being removed, so a beat's index -
 * and therefore its default id and the chat's cursor - stays stable no matter
 * which conditions currently hold.
 *
 * @internal
 */
export const resolveBeats = (script: Script): Array<Beat | null> =>
    script.build(m).map((entry, index) => {
        if (!entry) {
            return null;
        }

        return { ...entry, id: entry.id ?? `${script.id}:${index}` } as Beat;
    });

const indexedSlot = (slot: string, prefix: string): number =>
    slot.startsWith(prefix)
        ? Number.parseInt(slot.slice(prefix.length), 10)
        : Number.NaN;

const readSlot = (beat: Beat, slot: string): ReactNode => {
    if (beat.type === "choice") {
        return beat.options[indexedSlot(slot, "option:")]?.content as ReactNode;
    }

    if (beat.type === "message") {
        if (beat.body.kind === "text") {
            return slot === "text" ? (beat.body.text as ReactNode) : undefined;
        }

        if (slot === "caption") {
            return beat.body.caption as ReactNode;
        }

        return beat.body.items[indexedSlot(slot, "alt:")]?.alt as ReactNode;
    }

    return undefined;
};

/**
 * Reads the live content behind a {@link RefText}.
 *
 * Returns `undefined` when the script, the beat, or the slot no longer exists -
 * which happens when a script is edited after a save was written.
 *
 * @internal
 */
export const getBeatText = (
    scriptId: string,
    beatId: string,
    slot: string
): ReactNode => {
    const script = scripts.get(scriptId);

    if (!script) {
        return undefined;
    }

    const beat = resolveBeats(script).find(
        (candidate) => candidate?.id === beatId
    );

    if (!beat) {
        return undefined;
    }

    return readSlot(beat, slot);
};

/**
 * Warns when a script's beat count changed since a transcript referenced it,
 * which is the signature of default beat ids having shifted.
 *
 * @returns Whether a warning was emitted
 *
 * @internal
 */
export const warnOnScriptDrift = (
    chatId: string,
    scriptId: string,
    recordedBeatCount: number,
    currentBeatCount: number
): boolean => {
    if (recordedBeatCount === currentBeatCount) {
        return false;
    }

    logger.warn(
        `Script "${scriptId}" changed length since chat "${chatId}" last played it ` +
            `(${recordedBeatCount} beats recorded, ${currentBeatCount} now). ` +
            "Default beat ids may have shifted; give referenced beats explicit ids."
    );

    return true;
};

/**
 * Clears every defined script. Tests only.
 *
 * @internal
 */
export const _clearScripts = (): void => {
    scripts.clear();
};
