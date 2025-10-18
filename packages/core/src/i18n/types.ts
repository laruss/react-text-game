export type I18nConfig = {
    defaultLanguage?: string;
    fallbackLanguage?: string;
    debug?: boolean;
    resources: {
        [language: string]: {
            [namespace: string]: object;
        };
    };
};
