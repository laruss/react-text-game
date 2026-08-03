/**
 * Minimal logger for the messenger package.
 *
 * @remarks
 * Only warnings and errors, always emitted. Everything logged here is a real
 * problem an author needs to see: script drift, an unresolvable text reference,
 * a throwing callback, or a transcript growing without a cap.
 *
 * @internal
 */
export const logger = {
    warn(...what: Array<unknown>): void {
        console.warn("[react-text-game:messenger]", ...what);
    },
    error(...what: Array<unknown>): void {
        console.error("[react-text-game:messenger]", ...what);
    },
};
