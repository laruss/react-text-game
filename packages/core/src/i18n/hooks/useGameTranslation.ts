import { useTranslation } from "react-i18next";

import { setSetting } from "#saves/db";

export function useGameTranslation(namespace: string = "passages") {
    const { t, i18n } = useTranslation(namespace);

    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
        // Persist language preference to the database
        await setSetting("language", lang);
    };

    return {
        t,
        changeLanguage,
        currentLanguage: i18n.language,
        languages: i18n.languages,
    };
}
