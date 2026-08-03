/**
 * English defaults for this package's own strings.
 *
 * @remarks
 * Every key here is overridable: the author's `translations.resources` always win
 * over package defaults. Keys are grouped by what they describe, and interpolation
 * values match what the package passes - `who` is a contact id, so a game that
 * wants display names should render the notice itself instead.
 */
export const en = {
    "member.joined": "{{who}} joined the chat",
    "member.left": "{{who}} left the chat",
    typing: "typing...",
    "chat.readOnly": "You cannot reply in this chat",
    "divider.unread": "Unread messages",
    "divider.today": "Today",
    "divider.yesterday": "Yesterday",
    "media.album": "{{count}} items",
    "media.spoiler": "Tap to reveal",
    "message.deleted": "This message was deleted",
    "message.edited": "edited",
    "message.forwarded": "Forwarded message",
    "message.forwardedFrom": "Forwarded from {{who}}",
} as const;
