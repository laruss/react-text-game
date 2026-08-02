import { SYSTEM_PASSAGE_NAMES } from "#constants";
import type { I18nConfig } from "#i18n";
import { DEFAULT_CONFIG } from "#i18n/constants";
import type { PassageTarget } from "#passages/passage";

export type Options = {
    gameName: string;
    gameId: string;
    description: string;
    gameVersion: string;
    /**
     * Id of the passage the game opens on.
     *
     * @remarks
     * Always a string here: a passage instance passed to `Game.init()` is
     * resolved to its id before the options are stored.
     */
    startPassage: string;
    /**
     * Initial state of the game entities.
     * Use this prop to override default entity values for debugging or testing.
     *
     * Only supports game entity paths (e.g., { "player": { health: 50 } }).
     * System paths and unknown entities will be ignored.
     * Arrays will be replaced, not merged.
     *
     * @example
     * ```typescript
     * await Game.init({
     *   gameName: 'My Game',
     *   initialState: {
     *     player: { health: 50, name: 'TestPlayer' },
     *     inventory: { gold: 1000, items: ['sword', 'shield'] }
     *   }
     * });
     * ```
     */
    initialState: Record<string, unknown>;
    author: string;
    isDevMode: boolean;
    translations: I18nConfig;
};

export type NewOptions = Pick<Options, "gameName"> &
    Partial<Omit<Options, "gameName" | "startPassage">> & {
        /**
         * The passage the game opens on.
         *
         * Accepts a passage instance (`Story`, `InteractiveMap`, `Widget`, or
         * any other `Passage`) or the id of a registered passage. The passage
         * may register after `Game.init()`; navigation waits for it.
         *
         * @example
         * ```typescript
         * import { intro } from './game/stories/intro';
         *
         * await Game.init({ gameName: 'My Game', startPassage: intro });
         * await Game.init({ gameName: 'My Game', startPassage: 'intro' });
         * ```
         */
        startPassage?: PassageTarget;
    };

const options: Options = {
    gameName: "",
    gameId: "",
    description: "",
    startPassage: SYSTEM_PASSAGE_NAMES.START,
    gameVersion: "1.0.0",
    initialState: {},
    author: "",
    isDevMode: false,
    translations: DEFAULT_CONFIG,
};

export const newOptions = (opts: NewOptions) => {
    const { startPassage, ...rest } = opts;

    Object.assign(options, rest);

    if (startPassage !== undefined) {
        options.startPassage =
            typeof startPassage === "string" ? startPassage : startPassage.id;
    }
};

export const _getOptions = () => options;
