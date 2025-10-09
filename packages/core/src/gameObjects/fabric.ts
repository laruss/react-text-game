import { InitVarsType } from "#types";

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
 * @param id - Unique identifier used for registry lookups and persistence.
 * @param variables - Initial reactive state for the entity. Nested objects and
 * arrays are supported and proxied.
 * @returns A `SimpleObject` instance that can be used anywhere a
 * `BaseGameObject` is expected.
 */
export const createEntity = <Vars extends InitVarsType>(
    id: string,
    variables: Vars,
) => new SimpleObject({ id, variables });
