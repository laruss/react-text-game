# Type Alias: Component

> **Component** = [`TextComponent`](../interfaces/TextComponent.md) \| [`HeaderComponent`](../interfaces/HeaderComponent.md) \| [`ImageComponent`](../interfaces/ImageComponent.md) \| [`VideoComponent`](../interfaces/VideoComponent.md) \| [`ActionsComponent`](../interfaces/ActionsComponent.md) \| [`ConversationComponent`](../interfaces/ConversationComponent.md) \| [`AnotherStoryComponent`](../interfaces/AnotherStoryComponent.md)

Defined in: [packages/core/src/passages/story/types.ts:884](https://github.com/laruss/react-text-game/blob/64305e2af9f700712120b3eb6f2c37baf7743b28/packages/core/src/passages/story/types.ts#L884)

Union type of all available story component types.
Used for type-safe story content arrays.

## Remarks

This discriminated union allows TypeScript to narrow component types
based on the `type` property when rendering or processing components.
