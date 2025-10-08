export const callIfFunction = <T, Props>(
    value: T | ((props: Props | undefined) => T),
    props?: Props | undefined
): T => {
    return typeof value === "function"
        ? (value as (props: Props | undefined) => T)(props)
        : value;
};
