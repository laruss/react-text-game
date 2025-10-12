# Interface: ErrorBoundaryProps

Defined in: [packages/ui/src/components/ErrorBoundary/types.ts:10](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/ui/src/components/ErrorBoundary/types.ts#L10)

## Extends

- `PropsWithChildren`

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: node\_modules/@types/react/index.d.ts:1414

#### Inherited from

`PropsWithChildren.children`

***

### fallback()?

> `optional` **fallback**: (`error`, `errorInfo`, `reset`) => `ReactNode`

Defined in: [packages/ui/src/components/ErrorBoundary/types.ts:11](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/ui/src/components/ErrorBoundary/types.ts#L11)

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

##### reset

() => `void`

#### Returns

`ReactNode`

***

### onError()?

> `optional` **onError**: (`error`, `errorInfo`) => `void`

Defined in: [packages/ui/src/components/ErrorBoundary/types.ts:16](https://github.com/laruss/react-text-game/blob/325ef0387ed3a81c3cff0516cf5aab684d6f654f/packages/ui/src/components/ErrorBoundary/types.ts#L16)

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`
