# Interface: HeaderComponent

Defined in: [packages/core/src/passages/story/types.ts:140](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L140)

Component for displaying heading text at various levels.
Headers provide semantic structure and visual hierarchy to story content.

## Example

```typescript
// Main title
{ type: 'header', content: 'Chapter 1: The Beginning', props: { level: 1 } }

// Section heading
{ type: 'header', content: 'The Journey Begins', props: { level: 2 } }

// With custom styling
{ type: 'header', content: 'Warning!', props: { level: 3, className: 'text-danger-600' } }
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: `string`

Defined in: [packages/core/src/passages/story/types.ts:150](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L150)

The header text to display.
Plain text only - use TextComponent for rich content.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:27](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L27)

Optional unique identifier for this component.
Can be used to reference or manipulate specific components programmatically.

#### Example

```typescript
{ type: 'text', id: 'intro-text', content: 'Welcome!' }
```

#### Inherited from

`BaseComponent.id`

***

### initialVariant?

> `optional` **initialVariant**: `"display"` \| `"hidden"` \| `"disclosure"`

Defined in: [packages/core/src/passages/story/types.ts:42](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L42)

Controls the initial visibility state of the component.

#### Remarks

This property is designed for future UI implementation to support dynamic component visibility.
Currently defined but not yet implemented in the UI layer.

- `"display"` - Component is visible and rendered immediately (default behavior)
- `"hidden"` - Component exists but is not visible initially
- `"disclosure"` - Component is initially collapsed/hidden but can be expanded by user interaction

#### Default Value

`"display"`

#### Inherited from

`BaseComponent.initialVariant`

***

### props?

> `optional` **props**: `object`

Defined in: [packages/core/src/passages/story/types.ts:155](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L155)

Optional configuration for header level and styling.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the header.
Can be used to override default styling or add custom appearance.

##### Example

```typescript
props: { className: 'text-primary-600 font-bold' }
```

#### level?

> `optional` **level**: [`HeaderLevel`](../type-aliases/HeaderLevel.md)

Semantic heading level (1-6) corresponding to HTML h1-h6 elements.
Affects both visual size and document structure.

##### Default Value

```ts
1
```

***

### type

> **type**: `"header"`

Defined in: [packages/core/src/passages/story/types.ts:144](https://github.com/laruss/react-text-game/blob/daa646ced57537a6f88dd821fec37a65997af962/packages/core/src/passages/story/types.ts#L144)

Discriminator property identifying this as a header component.
