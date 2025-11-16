import { consola } from "consola/browser";
import { colors } from "consola/utils";

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
            consola.debug(colors.green("[DEBUG]"), ...what);
        }
    },
    log(...what: unknown[]) {
        if (this.level <= LEVELS.INFO) {
            consola.log(colors.blue("[INFO]"), ...what);
        }
    },
    warn(...what: unknown[]) {
        if (this.level <= LEVELS.WARN) {
            consola.warn(colors.yellow("[WARN]"), ...what);
        }
    },
    error(...what: unknown[]) {
        if (this.level <= LEVELS.ERROR) {
            consola.error(colors.red("[ERROR]"), ...what);
        }
    },
};
