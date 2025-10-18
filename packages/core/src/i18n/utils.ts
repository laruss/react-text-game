/**
 * Safely load UI translations from @react-text-game/ui package.
 * Returns an empty object if UI package is not installed.
 */
export async function loadUITranslations(): Promise<
    Record<string, Record<string, object>>
> {
    try {
        // @ts-expect-error TS2307
        const { uiTranslations } = await import("@react-text-game/ui/i18n");
        return uiTranslations;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
        // UI package isn't installed - this is expected for users with custom UIs
        return {};
    }
}
