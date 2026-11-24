import i18next, { type Resource } from "i18next";

import { deepMerge } from "#helpers";
import { logger } from "#logger";

let registeredTranslations: Resource = {};

const addResourceBundles = (resources: Resource): void => {
    for (const [language, namespaces] of Object.entries(resources)) {
        for (const [namespace, bundle] of Object.entries(namespaces)) {
            // deep merge, never overwrite: package defaults must lose to
            // whatever the game author already provided
            i18next.addResourceBundle(language, namespace, bundle, true, false);
        }
    }
};

/**
 * Registers default translations contributed by a package.
 *
 * Companion packages (for example `@react-text-game/ui` and
 * `@react-text-game/messenger`) ship their own namespace of default strings.
 * Registering them here means the game author gets working text without
 * copying resource bundles into `Game.init()`, while still being able to
 * override any key.
 *
 * The author's `translations.resources` always take precedence over
 * registered package defaults.
 *
 * @param resources - i18next resources, keyed by language and then namespace
 *
 * @remarks
 * Call order does not matter. Registering before `Game.init()` folds the
 * resources into the initial i18next configuration; registering afterwards adds
 * them through `addResourceBundle` without overwriting existing keys. Calling
 * this repeatedly accumulates resources, so several packages can contribute.
 *
 * @example
 * ```typescript
 * import { registerTranslations } from '@react-text-game/core/i18n';
 *
 * registerTranslations({
 *   en: { myPackage: { greeting: 'Hello' } },
 *   ru: { myPackage: { greeting: 'Привет' } },
 * });
 * ```
 */
export function registerTranslations(resources: Resource): void {
    registeredTranslations = deepMerge(
        registeredTranslations as Record<string, unknown>,
        resources as Record<string, unknown>
    ) as Resource;

    if (i18next.isInitialized) {
        addResourceBundles(resources);
    }

    logger.debug(
        `Registered package translations for: ${Object.keys(resources).join(", ")}`
    );
}

/**
 * Returns every translation registered through {@link registerTranslations}.
 *
 * @internal
 */
export function _getRegisteredTranslations(): Resource {
    return registeredTranslations;
}

/**
 * Adds every registered translation to i18next without overwriting keys that
 * are already present.
 *
 * @internal
 */
export function _applyRegisteredTranslations(): void {
    addResourceBundles(registeredTranslations);
}

/**
 * Drops all registered package translations.
 *
 * @internal
 */
export function _clearRegisteredTranslations(): void {
    registeredTranslations = {};
}
