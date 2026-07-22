import { _getOptions } from "#options";

const LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
} as const;

export const logger = {
    get level() {
        const { isDevMode } = _getOptions();
        return isDevMode ? LEVELS.DEBUG : LEVELS.WARN;
    },
    debug(...what: unknown[]) {
        if (this.level <= LEVELS.DEBUG) {
            console.debug("[react-text-game:debug]", ...what);
        }
    },
    log(...what: unknown[]) {
        if (this.level <= LEVELS.INFO) {
            console.info("[react-text-game]", ...what);
        }
    },
    warn(...what: unknown[]) {
        if (this.level <= LEVELS.WARN) {
            console.warn("[react-text-game:warn]", ...what);
        }
    },
    error(...what: unknown[]) {
        if (this.level <= LEVELS.ERROR) {
            console.error("[react-text-game:error]", ...what);
        }
    },
};
