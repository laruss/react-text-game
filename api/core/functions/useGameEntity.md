# Function: useGameEntity()

> **useGameEntity**\<`T`\>(`gameObject`): `T`

Defined in: [packages/core/src/hooks/useGameEntity.ts:58](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/hooks/useGameEntity.ts#L58)

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
