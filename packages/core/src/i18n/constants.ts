import { I18nConfig } from "./types";

export const DEFAULT_CONFIG = {
    defaultLanguage: "en",
    fallbackLanguage: "en",
    debug: false,
    resources: {},
} as const satisfies I18nConfig;
