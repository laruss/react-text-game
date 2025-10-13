# Interface: ErrorBoundaryProps

Defined in: [src/components/ErrorBoundary/types.ts:10](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/ui/src/components/ErrorBoundary/types.ts#L10)

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

Defined in: [src/components/ErrorBoundary/types.ts:11](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/ui/src/components/ErrorBoundary/types.ts#L11)

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

Defined in: [src/components/ErrorBoundary/types.ts:16](https://github.com/laruss/react-text-game/blob/59d7b8f771aa0b3a193326c59fd60a3d4ca5383b/packages/ui/src/components/ErrorBoundary/types.ts#L16)

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`
