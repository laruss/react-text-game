# Interface: TextComponent

Defined in: [packages/core/src/passages/story/types.ts:61](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L61)

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

Defined in: [packages/core/src/passages/story/types.ts:72](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L72)

The text or React element to display.
Supports strings, numbers, JSX elements, and any valid React node.
Multi-line text is rendered with preserved whitespace and line breaks.

***

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/passages/story/types.ts:27](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L27)

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

Defined in: [packages/core/src/passages/story/types.ts:42](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L42)

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

Defined in: [packages/core/src/passages/story/types.ts:77](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L77)

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

Defined in: [packages/core/src/passages/story/types.ts:65](https://github.com/laruss/react-text-game/blob/82dd17c6be044470eb82037b1d8d59eedbfff48e/packages/core/src/passages/story/types.ts#L65)

Discriminator property identifying this as a text component.
