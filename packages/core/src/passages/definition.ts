import { Game } from "#game";
import type { Passage } from "#passages/passage";
import type { EmptyObject, InitVarsType } from "#types";

/**
 * Signature shared by every `define*` passage factory.
 *
 * The content callback always receives the passage-specific helper toolbox as
 * its first argument and the display props as its second, so learning one
 * factory teaches all of them.
 *
 * @template THelpers - Helper toolbox for the passage type
 * @template TContent - Value the callback must return
 * @template TProps - Props passed to `display()`
 *
 * @example
 * ```typescript
 * const content: DefineFn<StoryHelpers, StoryContentItems> = (h) => [
 *   h.header('Chapter 1'),
 *   h.text('Your journey begins...')
 * ];
 * ```
 */
export type DefineFn<
    THelpers,
    TContent,
    TProps extends InitVarsType = EmptyObject,
> = (helpers: THelpers, props: TProps) => TContent;

/**
 * A value that may be omitted from a helper array.
 *
 * Falsy entries are removed before the passage is rendered, which lets
 * conditional content be written inline with `&&` instead of a callback that
 * returns `undefined`.
 *
 * @example
 * ```typescript
 * defineStory('room', (h) => [
 *   h.text('A locked door blocks your way.'),
 *   player.hasKey && h.actions([{ label: 'Unlock', action: h.jump('hall') }])
 * ]);
 * ```
 */
export type Conditional<T> = T | false | null | undefined;

/**
 * Flattens a component or hotspot type into the single options bag its helper
 * accepts: everything nested under `props` is hoisted to the top level.
 *
 * @remarks
 * Derived from the source type, so helper options can never drift from the
 * object shape they build.
 */
export type HelperOptions<T> = Omit<T, "props"> &
    (T extends { props?: infer TProps } ? NonNullable<TProps> : unknown);

/**
 * Helpers available in every passage type's toolbox.
 */
export type CommonHelpers = {
    /**
     * Builds a click handler that navigates to another passage.
     *
     * @param target - Passage instance or registered passage id
     * @returns Callback suitable for any `action` field
     *
     * @example
     * ```typescript
     * h.actions([{ label: 'Continue', action: h.jump('chapter-2') }]);
     * ```
     */
    jump: (target: Passage | string) => () => void;

    /**
     * Returns `value` when `condition` is truthy, otherwise `undefined`.
     *
     * @remarks
     * Pass a function to defer evaluation until the condition passes. Plain
     * `&&` works just as well for simple cases; `when` exists for values that
     * are expensive to build or that would be falsy on their own.
     *
     * @example
     * ```typescript
     * h.when(player.hasMap, () => h.image('/map.png'));
     * ```
     */
    when: <T>(condition: unknown, value: T | (() => T)) => T | undefined;
};

/**
 * Shared helper implementations mixed into every passage toolbox.
 */
export const commonHelpers: CommonHelpers = {
    jump: (target) => () => {
        Game.jumpTo(target);
    },
    when: <T>(condition: unknown, value: T | (() => T)): T | undefined => {
        if (!condition) {
            return undefined;
        }

        return typeof value === "function" ? (value as () => T)() : value;
    },
};

/**
 * Assembles a component/hotspot object from a flat options bag.
 *
 * Keys listed in `rootKeys` stay at the top level; every other key moves under
 * `props`. Keys explicitly set to `undefined` are dropped so the result stays
 * compatible with `exactOptionalPropertyTypes`.
 *
 * @internal
 */
export const buildFromFlatOptions = <TResult>(
    base: Record<string, unknown>,
    options: Record<string, unknown>,
    rootKeys: ReadonlyArray<string>
): TResult => {
    const result: Record<string, unknown> = { ...base };
    const props: Record<string, unknown> = {};

    for (const key of Object.keys(options)) {
        const value = options[key];

        if (value === undefined) {
            continue;
        }

        if (rootKeys.includes(key)) {
            result[key] = value;
        } else {
            props[key] = value;
        }
    }

    if (Object.keys(props).length > 0) {
        result.props = props;
    }

    return result as TResult;
};

/**
 * Removes `false`, `null` and `undefined` entries from a helper array.
 *
 * @internal
 */
export const compact = <T>(items: ReadonlyArray<Conditional<T>>): Array<T> =>
    items.filter(
        (item): item is T =>
            item !== false && item !== null && item !== undefined
    );
