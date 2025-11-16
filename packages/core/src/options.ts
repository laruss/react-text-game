import { SYSTEM_PASSAGE_NAMES } from "#constants";
import type { I18nConfig } from "#i18n";
import { DEFAULT_CONFIG } from "#i18n/constants";

export type Options = {
    gameName: string;
    gameId: string;
    description: string;
    gameVersion: string;
    startPassage: string;
    author: string;
    isDevMode: boolean;
    translations: I18nConfig;
};

export type NewOptions = Pick<Options, "gameName"> &
    Partial<Omit<Options, "gameName">>;

const options: Options = {
    gameName: "",
    gameId: "",
    description: "",
    startPassage: SYSTEM_PASSAGE_NAMES.START,
    gameVersion: "1.0.0",
    author: "",
    isDevMode: false,
    translations: DEFAULT_CONFIG,
};

export const newOptions = (opts: NewOptions) => {
    Object.assign(options, opts);
};

export const _getOptions = () => options;
