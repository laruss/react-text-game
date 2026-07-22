# Interface: TextComponent

Defined in: [packages/core/src/passages/story/types.ts:58](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L58)

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

Defined in: [packages/core/src/passages/story/types.ts:69](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L69)

The text or React element to display.
Supports strings, numbers, JSX elements, and any valid React node.
Multi-line text is rendered with preserved whitespace and line breaks.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:24](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L24)

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

Defined in: [packages/core/src/passages/story/types.ts:39](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L39)

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

Defined in: [packages/core/src/passages/story/types.ts:74](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L74)

Optional configuration for styling and behavior.

#### className?

> `optional` **className**: `string`

CSS class name(s) to apply to the text container.
Can be used to customize text appearance (color, font, alignment, etc.).

##### Example

```typescript
props: { className: 'text-lg font-bold text-center' }
```

#### isHTML?

> `optional` **isHTML**: `boolean`

When `true`, renders the content as raw HTML using `dangerouslySetInnerHTML`.
This allows using HTML markup in `.ts` files without needing JSX/TSX.

##### Default Value

```ts
false
```

##### Remarks

- Only works when `content` is a string. If `content` is a ReactNode,
  this prop is ignored and the content is rendered normally.
- The browser handles HTML parsing natively and is forgiving with malformed HTML.
- **Security:** Since game authors control their own content, XSS is not
  a concern. Do not use with untrusted user input.

##### Example

```typescript
// In a .ts file (no JSX needed)
{
  type: 'text',
  content: '<strong>Bold</strong> and <em>italic</em> text',
  props: { isHTML: true }
}
```

***

### type

> **type**: `"text"`

Defined in: [packages/core/src/passages/story/types.ts:62](https://github.com/laruss/react-text-game/blob/9737b4ebadc29a1bdfe4aa04d20ce15868420c88/packages/core/src/passages/story/types.ts#L62)

Discriminator property identifying this as a text component.
