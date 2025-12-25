export const callIfFunction = <T, Props>(
    value: T | ((props: Props | undefined) => T),
    props?: Props | undefined
): T => {
    return typeof value === "function"
        ? (value as (props: Props | undefined) => T)(props)
        : value;
};

/**
 * Deep merges source object into target object.
 * - Recursively merges nested objects
 * - Replaces arrays instead of merging
 * - Skips undefined/null values
 *
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns The merged object
 *
 * @example
 * ```typescript
 * const target = { a: 1, b: { c: 2, d: 3 } };
 * const source = { b: { c: 4 }, e: 5 };
 * const result = deepMerge(target, source);
 * // result: { a: 1, b: { c: 4, d: 3 }, e: 5 }
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(
    target: T,
    source: Record<string, unknown>
): T {
    const output = { ...target } as Record<string, unknown>;

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = output[key];

        // Skip undefined/null
        if (sourceValue === undefined || sourceValue === null) {
            continue;
        }

        // Replace arrays (don't merge)
        if (Array.isArray(sourceValue)) {
            output[key] = sourceValue;
            continue;
        }

        // Deep merge objects
        if (
            typeof sourceValue === "object" &&
            typeof targetValue === "object" &&
            !Array.isArray(targetValue)
        ) {
            output[key] = deepMerge(
                targetValue as Record<string, unknown>,
                sourceValue as Record<string, unknown>
            );
        } else {
            // Primitive value or different types - replace
            output[key] = sourceValue;
        }
    }

    return output as T;
}
