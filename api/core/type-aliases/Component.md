# Type Alias: Component

> **Component** = [`TextComponent`](../interfaces/TextComponent.md) \| [`HeaderComponent`](../interfaces/HeaderComponent.md) \| [`ImageComponent`](../interfaces/ImageComponent.md) \| [`VideoComponent`](../interfaces/VideoComponent.md) \| [`ActionsComponent`](../interfaces/ActionsComponent.md) \| [`ConversationComponent`](../interfaces/ConversationComponent.md) \| [`AnotherStoryComponent`](../interfaces/AnotherStoryComponent.md)

Defined in: [packages/core/src/passages/story/types.ts:913](https://github.com/laruss/react-text-game/blob/2ad06f0c2b75629ab66c4b4b4c41ce3af0a24310/packages/core/src/passages/story/types.ts#L913)

Union type of all available story component types.
Used for type-safe story content arrays.

## Remarks

This discriminated union allows TypeScript to narrow component types
based on the `type` property when rendering or processing components.
