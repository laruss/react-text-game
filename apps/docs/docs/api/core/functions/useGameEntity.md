# Function: useGameEntity()

> **useGameEntity**\<`T`\>(`gameObject`): `T`

Defined in: [hooks/useGameEntity.ts:58](https://github.com/laruss/react-text-game/blob/9170bd136d7f37dbbee8bf6f71732f065efa0401/packages/core/src/hooks/useGameEntity.ts#L58)

Monitors changes to a given game entity by wrapping it in a Valtio proxy.
This hook enables React components to automatically re-render when the entity's state changes.

## Type Parameters

### T

`T` *extends* [`BaseGameObject`](../classes/BaseGameObject.md)\<[`InitVarsType`](../type-aliases/InitVarsType.md)\>

## Parameters

### gameObject

`T`

The game entity to observe. Must extend BaseGameObject and be registered.

## Returns

`T`

The proxied game entity that triggers re-renders on state changes.

## Example

```tsx
import { useGameEntity } from "@app/hooks";
import { environment } from "@game/entities/environment";

function TemperatureDisplay() {
  const env = useGameEntity(environment);
  return <div>Temperature: {env.variables.temperature}°C</div>;
}
```
