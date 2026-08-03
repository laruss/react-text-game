import { PLAYER_SENDER, SYSTEM_SENDER } from "#constants";
import {
    type PlainRichText,
    resolvePlainRichText,
    toPlainRichText,
} from "#text";
import type { StaticText } from "#types";

/**
 * A participant in a chat: an NPC, a channel, or the player.
 *
 * @remarks
 * Contacts are definitions, not persisted state. Their ids end up inside saved
 * transcripts, so treat a contact id like a passage id: never rename it once a
 * game has shipped.
 */
export type Contact = {
    readonly id: string;

    /** Display name, resolved through i18next when built with `m.t()`. */
    readonly name?: PlainRichText;

    /** Avatar image, used as the fallback avatar of a direct chat. */
    readonly avatar?: string;

    /** Arbitrary author data, for example a phone number or an online flag. */
    readonly meta?: Record<string, unknown>;
};

/**
 * Options accepted by {@link defineContact}.
 */
export type ContactOptions = {
    name?: StaticText;
    avatar?: string;
    meta?: Record<string, unknown>;
};

const contacts = new Map<string, Contact>();

/**
 * Defines a chat participant.
 *
 * @param id - Unique, persistent identifier
 * @param options - Display name, avatar, and any author metadata
 * @returns The contact, usable anywhere a sender is expected
 * @throws Error if the id is already taken or is a reserved sender id
 *
 * @example
 * ```typescript
 * import { defineContact, m } from '@react-text-game/messenger';
 *
 * export const anna = defineContact('anna', {
 *   name: m.t('contacts.anna'),
 *   avatar: '/avatars/anna.webp',
 * });
 * ```
 */
export const defineContact = (
    id: string,
    options: ContactOptions = {}
): Contact => {
    if (id === SYSTEM_SENDER) {
        throw new Error(
            `Contact id "${SYSTEM_SENDER}" is reserved for in-fiction system notices.`
        );
    }

    if (contacts.has(id)) {
        throw new Error(`Contact "${id}" is already defined.`);
    }

    const contact: Contact = {
        id,
        ...(options.name === undefined
            ? {}
            : { name: toPlainRichText(options.name) }),
        ...(options.avatar === undefined ? {} : { avatar: options.avatar }),
        ...(options.meta === undefined ? {} : { meta: options.meta }),
    };

    contacts.set(id, contact);

    return contact;
};

/**
 * Looks up a defined contact.
 *
 * @param id - Contact id
 * @returns The contact, or `undefined` when nothing was defined under that id
 */
export const getContact = (id: string): Contact | undefined => contacts.get(id);

/**
 * Resolves a sender id to a display name.
 *
 * Falls back to the sender id when the contact has no name or was never
 * defined, so an unknown sender still renders something meaningful.
 *
 * @param id - Contact id, `"player"`, or `"system"`
 */
export const resolveSenderName = (id: string): string => {
    const contact = contacts.get(id);

    if (contact?.name) {
        return resolvePlainRichText(contact.name);
    }

    return id;
};

/**
 * Resolves a sender id to an avatar, when it has one.
 */
export const resolveSenderAvatar = (id: string): string | undefined =>
    contacts.get(id)?.avatar;

/**
 * Normalizes anything usable as a sender into an id.
 *
 * @internal
 */
export const toSenderId = (sender: Contact | string): string =>
    typeof sender === "string" ? sender : sender.id;

/**
 * The player, as a sender id.
 *
 * @remarks
 * Define a contact with this id to give the player a display name and avatar.
 */
export const playerSenderId = PLAYER_SENDER;

/**
 * Clears every defined contact. Tests only.
 *
 * @internal
 */
export const _clearContacts = (): void => {
    contacts.clear();
};
