# Interface: TextComponent

Defined in: [passages/story/types.ts:58](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L58)

Component for displaying text content in the story.
Supports rich text, JSX elements, and multi-line content with preserved whitespace.

## Example

```typescript
// Simple text
{ type: 'text', content: 'Once upon a time...' }

// Multi-line text
{ type: 'text', content: 'Line 1\nLine 2\nLine 3' }

// JSX content
{ type: 'text', content: <><strong>Bold</strong> and <em>italic</em></> }
```

## Extends

- `BaseComponent`

## Properties

### content

> **content**: `ReactNode`

Defined in: [passages/story/types.ts:69](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L69)

The text or React element to display.
Supports strings, numbers, JSX elements, and any valid React node.
Multi-line text is rendered with preserved whitespace and line breaks.

***

### id?

> `optional` **id**: `string`

Defined in: [passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L24)

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

> `optional` **initialVariant**: `"hidden"` \| `"display"` \| `"disclosure"`

Defined in: [passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L39)

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

Defined in: [passages/story/types.ts:74](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L74)

Optional configuration for styling and behavior.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the text container.
Can be used to customize text appearance (color, font, alignment, etc.).

##### Example

```typescript
props: { className: 'text-lg font-bold text-center' }
```

***

### type

> **type**: `"text"`

Defined in: [passages/story/types.ts:62](https://github.com/laruss/react-text-game/blob/ebc985d74d2d38c34169b7426a7d28520cf19743/packages/core/src/passages/story/types.ts#L62)

Discriminator property identifying this as a text component.
