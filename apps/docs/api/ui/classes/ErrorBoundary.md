# Class: ErrorBoundary

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:17](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L17)

ErrorBoundary catches all JavaScript errors in the application:
- Rendering errors
- Event handler errors
- Async errors (promises, setTimeout)
- Global uncaught errors

## Extends

- `Component`\<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), [`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md)\>

## Constructors

### Constructor

> **new ErrorBoundary**(`props`): `ErrorBoundary`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:21](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L21)

#### Parameters

##### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

#### Returns

`ErrorBoundary`

#### Overrides

`Component< ErrorBoundaryProps, ErrorBoundaryState >.constructor`

## Properties

### context

> **context**: `unknown`

Defined in: node\_modules/@types/react/index.d.ts:946

If using React Context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

#### Example

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

#### See

[React Docs](https://react.dev/reference/react/Component#context)

#### Inherited from

`Component.context`

***

### props

> `readonly` **props**: `Readonly`\<`P`\>

Defined in: node\_modules/@types/react/index.d.ts:970

#### Inherited from

`Component.props`

***

### state

> **state**: `Readonly`\<`S`\>

Defined in: node\_modules/@types/react/index.d.ts:971

#### Inherited from

`Component.state`

***

### contextType?

> `static` `optional` **contextType**: `Context`\<`any`\>

Defined in: node\_modules/@types/react/index.d.ts:922

If set, `this.context` will be set at runtime to the current value of the given Context.

#### Example

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render () {
    return <>My context's value: {this.context}</>;
  }
}
```

#### See

[https://react.dev/reference/react/Component#static-contexttype](https://react.dev/reference/react/Component#static-contexttype)

#### Inherited from

`Component.contextType`

***

### ~~propTypes?~~

> `static` `optional` **propTypes**: `any`

Defined in: node\_modules/@types/react/index.d.ts:928

Ignored by React.

#### Deprecated

Only kept in types for backwards compatibility. Will be removed in a future major release.

#### Inherited from

`Component.propTypes`

## Methods

### componentDidCatch()

> **componentDidCatch**(`error`, `errorInfo`): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:112](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L112)

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

##### error

`Error`

##### errorInfo

`ErrorInfo`

#### Returns

`void`

#### Overrides

`Component.componentDidCatch`

***

### componentDidMount()

> **componentDidMount**(): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:35](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L35)

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Overrides

`Component.componentDidMount`

***

### componentDidUpdate()?

> `optional` **componentDidUpdate**(`prevProps`, `prevState`, `snapshot?`): `void`

Defined in: node\_modules/@types/react/index.d.ts:1252

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if [getSnapshotBeforeUpdate](#getsnapshotbeforeupdate) is present and returns non-null.

#### Parameters

##### prevProps

`Readonly`\<`P`\>

##### prevState

`Readonly`\<`S`\>

##### snapshot?

`any`

#### Returns

`void`

#### Inherited from

`Component.componentDidUpdate`

***

### ~~componentWillMount()?~~

> `optional` **componentWillMount**(): `void`

Defined in: node\_modules/@types/react/index.d.ts:1268

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.componentWillMount`

***

### ~~componentWillReceiveProps()?~~

> `optional` **componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Defined in: node\_modules/@types/react/index.d.ts:1299

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

##### nextProps

`Readonly`\<`P`\>

##### nextContext

`any`

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.componentWillReceiveProps`

***

### componentWillUnmount()

> **componentWillUnmount**(): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:46](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L46)

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

#### Returns

`void`

#### Overrides

`Component.componentWillUnmount`

***

### ~~componentWillUpdate()?~~

> `optional` **componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Defined in: node\_modules/@types/react/index.d.ts:1331

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

##### nextProps

`Readonly`\<`P`\>

##### nextState

`Readonly`\<`S`\>

##### nextContext

`any`

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.componentWillUpdate`

***

### copyErrorToClipboard()

> **copyErrorToClipboard**(): `Promise`\<`void`\>

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:132](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L132)

#### Returns

`Promise`\<`void`\>

***

### forceUpdate()

> **forceUpdate**(`callback?`): `void`

Defined in: node\_modules/@types/react/index.d.ts:967

#### Parameters

##### callback?

() => `void`

#### Returns

`void`

#### Inherited from

`Component.forceUpdate`

***

### getSnapshotBeforeUpdate()?

> `optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Defined in: node\_modules/@types/react/index.d.ts:1246

Runs before React applies the result of Component.render render to the document, and
returns an object to be given to [componentDidUpdate](#componentdidupdate). Useful for saving
things such as scroll position before Component.render render causes changes to it.

Note: the presence of this method prevents any of the deprecated
lifecycle events from running.

#### Parameters

##### prevProps

`Readonly`\<`P`\>

##### prevState

`Readonly`\<`S`\>

#### Returns

`any`

#### Inherited from

`Component.getSnapshotBeforeUpdate`

***

### handleGlobalError()

> **handleGlobalError**(`event`): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:54](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L54)

#### Parameters

##### event

`ErrorEvent`

#### Returns

`void`

***

### handlePromiseRejection()

> **handlePromiseRejection**(`event`): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:89](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L89)

#### Parameters

##### event

`PromiseRejectionEvent`

#### Returns

`void`

***

### render()

> **render**(): `ReactNode`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:157](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L157)

#### Returns

`ReactNode`

#### Overrides

`Component.render`

***

### reset()

> **reset**(): `void`

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:124](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L124)

#### Returns

`void`

***

### setState()

> **setState**\<`K`\>(`state`, `callback?`): `void`

Defined in: node\_modules/@types/react/index.d.ts:962

#### Type Parameters

##### K

`K` *extends* keyof [`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md)

#### Parameters

##### state

`null` | [`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md) | (`prevState`, `props`) => `null` \| [`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md) \| `Pick`\<[`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md), `K`\> | `Pick`\<[`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md), `K`\>

##### callback?

() => `void`

#### Returns

`void`

#### Inherited from

`Component.setState`

***

### shouldComponentUpdate()?

> `optional` **shouldComponentUpdate**(`nextProps`, `nextState`, `nextContext`): `boolean`

Defined in: node\_modules/@types/react/index.d.ts:1200

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, Component.render, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

##### nextProps

`Readonly`\<`P`\>

##### nextState

`Readonly`\<`S`\>

##### nextContext

`any`

#### Returns

`boolean`

#### Inherited from

`Component.shouldComponentUpdate`

***

### ~~UNSAFE\_componentWillMount()?~~

> `optional` **UNSAFE\_componentWillMount**(): `void`

Defined in: node\_modules/@types/react/index.d.ts:1283

Called immediately before mounting occurs, and before Component.render.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Returns

`void`

#### Deprecated

16.3, use ComponentLifecycle.componentDidMount componentDidMount or the constructor instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.UNSAFE_componentWillMount`

***

### ~~UNSAFE\_componentWillReceiveProps()?~~

> `optional` **UNSAFE\_componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Defined in: node\_modules/@types/react/index.d.ts:1317

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling Component.setState generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

##### nextProps

`Readonly`\<`P`\>

##### nextContext

`any`

#### Returns

`void`

#### Deprecated

16.3, use static StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.UNSAFE_componentWillReceiveProps`

***

### ~~UNSAFE\_componentWillUpdate()?~~

> `optional` **UNSAFE\_componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Defined in: node\_modules/@types/react/index.d.ts:1347

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call Component.setState here.

This method will not stop working in React 17.

Note: the presence of NewLifecycle.getSnapshotBeforeUpdate getSnapshotBeforeUpdate
or StaticLifecycle.getDerivedStateFromProps getDerivedStateFromProps prevents
this from being invoked.

#### Parameters

##### nextProps

`Readonly`\<`P`\>

##### nextState

`Readonly`\<`S`\>

##### nextContext

`any`

#### Returns

`void`

#### Deprecated

16.3, use getSnapshotBeforeUpdate instead

#### See

 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update)
 - [https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path)

#### Inherited from

`Component.UNSAFE_componentWillUpdate`

***

### getDerivedStateFromError()

> `static` **getDerivedStateFromError**(`error`): `Partial`\<[`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md)\>

Defined in: [packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx:31](https://github.com/laruss/react-text-game/blob/4531810ed426df9948c54abd8dbf61d1745871f2/packages/ui/src/components/ErrorBoundary/ErrorBoundary.tsx#L31)

#### Parameters

##### error

`Error`

#### Returns

`Partial`\<[`ErrorBoundaryState`](../interfaces/ErrorBoundaryState.md)\>
