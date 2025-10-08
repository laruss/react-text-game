import { SYSTEM_PASSAGE_NAMES } from "#constants";

export type Options = {
    gameName: string;
    gameId: string;
    description: string;
    gameVersion: string;
    startPassage: string;
    author: string;
    isDevMode: boolean;
};

export type NewOptions = Pick<Options, "gameName"> & Partial<Omit<Options, "gameName">>;

const options: Options = {
    gameName: "",
    gameId: "",
    description: "",
    startPassage: SYSTEM_PASSAGE_NAMES.START,
    gameVersion: "1.0.0",
    author: "",
    isDevMode: false,
};

export const newOptions = (opts: NewOptions) => {
    Object.assign(options, opts);
};

export const _getOptions = () => options;
