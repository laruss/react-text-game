/**
 * Entity id of the messenger store.
 *
 * @remarks
 * Reserved: a game entity with this id collides with the store and the engine
 * will reject the duplicate registration.
 */
export const MESSENGER_STORE_ID = "messenger";

/**
 * Sender id standing for the player.
 */
export const PLAYER_SENDER = "player";

/**
 * Sender id standing for in-fiction system notices such as "Anna joined".
 */
export const SYSTEM_SENDER = "system";

/**
 * i18next namespace holding this package's own default strings.
 */
export const MESSENGER_I18N_NAMESPACE = "messenger";

/**
 * i18next namespace author message keys resolve against.
 *
 * @remarks
 * Matches the default namespace of `getGameTranslation()` in core. Prefix a key
 * with `"otherNamespace:"` to read from somewhere else.
 */
export const AUTHOR_I18N_NAMESPACE = "passages";

/**
 * Settings key the cross-save seen record is persisted under.
 */
export const SEEN_SETTING_KEY = "messenger:seen";

/**
 * Debounce applied before the seen record is written to the settings table.
 */
export const SEEN_FLUSH_DEBOUNCE_MS = 250;

/**
 * Entry count after which a chat warns about an unbounded transcript.
 *
 * @remarks
 * Transcripts are uncapped by default so history is never silently lost. The
 * warning exists because the engine serializes the whole state tree into
 * `sessionStorage` on every auto-save; set `maxEntries` on the chat once a
 * transcript gets long.
 */
export const ENTRY_WARN_THRESHOLD = 1000;
