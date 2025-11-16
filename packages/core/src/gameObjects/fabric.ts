import { AssertNoOptionals, InitVarsType } from "#types";

import { SimpleObject } from "./simpleObject";

/**
 * Convenience factory that wraps {@link SimpleObject} creation.
 *
 * This function mirrors the fabric-style APIs used for passages so entity
 * authors can define state in plain objects and still get reactive behaviour.
 * The created entity is registered with the game engine via the
 * `BaseGameObject` constructor and exposes its variables as direct
 * properties.
 *
 * **IMPORTANT:** All properties in `variables` must be required (non-optional).
 * The `AssertNoOptionals` type enforces this at compile time. Optional properties
 * are not supported because the Proxy-based implementation cannot distinguish
 * between undefined optional values and missing properties. If you need optional-like
 * behavior, use explicit `undefined` with a union type (e.g., `field: undefined as string | undefined`).
 *
 * @param id - Unique identifier used for registry lookups and persistence.
 * @param variables - Initial reactive state for the entity. Nested objects and
 * arrays are supported and proxied. Must not contain optional properties.
 * @returns A `SimpleObject` instance that can be used anywhere a
 * `BaseGameObject` is expected.
 *
 * @example
 * ```typescript
 * // ✅ Correct - All properties are required
 * const player = createEntity('player', {
 *   health: 100,
 *   name: 'Hero',
 *   inventory: [] as string[]
 * });
 *
 * // ✅ Correct - Use explicit undefined for optional-like behavior
 * const character = createEntity('character', {
 *   name: 'NPC',
 *   quest: undefined as string | undefined
 * });
 *
 * // ❌ Wrong - Optional properties will cause compilation error
 * const player = createEntity('player', {
 *   health: 100,
 *   mana?: 50  // TypeScript error: optional keys not allowed
 * });
 * ```
 */
export const createEntity = <Vars extends InitVarsType>(
    id: string,
    variables: Vars & AssertNoOptionals<Vars>
) => new SimpleObject({ id, variables });
