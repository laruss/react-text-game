export type EmptyObject = Record<string, never>;

export type JsonPath = `$.${string}`;

export type InitVarsType = Record<string, unknown>;

type Identity<T> = { [P in keyof T]: T[P] };
export type Replace<T, K extends keyof T, TReplace> = Identity<
    Pick<T, Exclude<keyof T, K>> & {
        [P in K]: TReplace;
    }
>;

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
