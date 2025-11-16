export type EmptyObject = Record<string, never>;

export type JsonPath = `$.${string}`;

export type InitVarsType = Record<string, unknown>;

export type Identity<T> = { [P in keyof T]: T[P] };
export type Replace<T, K extends keyof T, TReplace> = Identity<
    Pick<T, Exclude<keyof T, K>> & {
        [P in K]: TReplace;
    }
>;

export type OptionalKeys<T> = {
    [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * A utility type that enforces the absence of optional keys in a given type `T`.
 * If `T` contains any optional keys, it will produce a compile-time error listing the keys
 * that need to be removed or made required.
 *
 * @template T - The object type to be validated for optional keys.
 */
export type AssertNoOptionals<T> = [OptionalKeys<T>] extends [never]
    ? unknown
    : {
          /**
           * ❌ Optional keys are not allowed.
           * Remove or make required these keys:
           */
          "Error: no optional keys": OptionalKeys<T>;
      };

export type GameSaveState = Record<string, unknown>;

export type PassageType = "story" | "interactiveMap" | "widget";

export type Callable<T> = () => T;
export type MaybeCallable<T> = T | Callable<T>;
export type OptionalCallable<T> = Callable<T | undefined>;
export type MaybeOptionalCallable<T> = T | OptionalCallable<T>;

export type ButtonVariant =
    | "solid"
    | "faded"
    | "bordered"
    | "light"
    | "flat"
    | "ghost"
    | "shadow";

export type ButtonColor =
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
