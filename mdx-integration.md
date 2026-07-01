# MDX Integration

The `@react-text-game/mdx` package enables you to write game passages using MDX (Markdown + JSX), combining narrative content with interactive React components in an author-friendly format.

## Why MDX?

- **Author-friendly**: Write game content in familiar Markdown syntax
- **Component integration**: Embed React components directly in your narrative
- **Type-safe**: Full TypeScript support for your custom components
- **Vite integration**: Optimized build pipeline with Vite plugin
- **Structured data extraction**: Automatically extract metadata and story structure from MDX files

## Installation

Install the package along with its peer dependencies:

```bash
# Using Bun
bun add @react-text-game/mdx @mdx-js/mdx @mdx-js/react

# Using npm
npm install @react-text-game/mdx @mdx-js/mdx @mdx-js/react
```

## Setup

### With Vite

1. **Set up MDX** following the [official MDX documentation](https://mdxjs.com/docs/getting-started/#vite)

2. **Add the React Text Game plugin** to your MDX configuration in `vite.config.ts`:

```typescript
import mdx from "@mdx-js/rollup";
import { reactTextGameStoryPlugin } from "@react-text-game/mdx/plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        {
            enforce: "pre",
            ...mdx({ ...reactTextGameStoryPlugin() }),
        },
        react(),
    ],
});
```

### With Other Bundlers

Follow the [MDX installation guide](https://mdxjs.com/docs/getting-started/) for your bundler, then pass `reactTextGameStoryPlugin()` as an option to the MDX compiler:

```javascript
import { compile } from "@mdx-js/mdx";
import { reactTextGameStoryPlugin } from "@react-text-game/mdx/plugin";

await compile(mdxSource, { ...reactTextGameStoryPlugin() });
```

## Basic Usage

Create an MDX file for your story (e.g., `src/game/stories/intro.mdx`):

```mdx
---
passageId: intro
---

import { Action, Actions } from "@react-text-game/mdx";
import { player } from "../entities/player";

# Welcome to the Adventure

Hello, {player.name}! This is your first passage.

<Actions>
    <Action onPerform={() => alert("Started!")}>Start Adventure</Action>
</Actions>
```

**Import your MDX files** so they register with the game engine. The recommended approach is to create a registry structure:

```typescript
// src/game/stories/index.ts
import "./intro.mdx";
import "./chapter1.mdx";

// src/game/registry.ts
export * from "./stories";

// src/main.tsx
import "./game/registry";
```

## Components Reference

### Text & Headers

Standard Markdown text and headers are automatically converted to the appropriate core components:

```mdx
# Header Level 1

## Header Level 2

### Header Level 3

Regular paragraph text becomes a text component.
```

### Images & Video

Use standard Markdown image syntax or HTML elements:

```mdx
![Alt text](./image.png "Image title")

<img src="./image.png" alt="Alt text" />

<video src="./video.mp4" />
```

### `<Actions>` and `<Action>`

Container for interactive action buttons. Each `<Action>` represents a clickable choice.

```mdx
<Actions>
    <Action onPerform={() => alert("Action 1")}>First Choice</Action>
    <Action
        onPerform={() => Game.jumpTo("chapter2")}
        color="danger"
        variant="bordered"
    >
        Dangerous Choice
    </Action>
</Actions>
```

**Props for `<Action>`:**

- `onPerform: () => void` - Callback executed when clicked (required)
- `children: string` - Button label text (required)
- `color?: ButtonColor` - Color scheme: `"default"`, `"primary"`, `"secondary"`, `"success"`, `"warning"`, `"danger"`
- `variant?: ButtonVariant` - Style variant: `"solid"`, `"bordered"`, `"light"`, `"flat"`, `"faded"`, `"shadow"`, `"ghost"`
- `isDisabled?: boolean` - Disable the button
- `tooltip?: object` - Tooltip configuration
- `className?: string` - Custom CSS classes

**Props for `<Actions>`:**

- `direction?: "horizontal" | "vertical"` - Layout direction (default: `"horizontal"`)
- `className?: string` - Custom CSS classes

### `<Conversation>` and `<Say>`

Display dialogue or conversation sequences with multiple messages.

```mdx
<Conversation>
    <Say>Hello there!</Say>
    <Say who={{ name: "NPC", avatar: "./npc.png" }} side="left">
        Greetings, traveler!
    </Say>
    <Say who={{ name: "Player" }} side="right" color="#3b82f6">
        I'm looking for the temple.
    </Say>
</Conversation>
```

**Props for `<Say>`:**

- `children: ReactNode` - Message content (required)
- `who?: { name?: string; avatar?: string }` - Speaker information
- `side?: "left" | "right"` - Message alignment (default: `"left"`)
- `color?: string` - Custom bubble color (hex format)
- `classNames?: object` - CSS class overrides

**Props for `<Conversation>`:**

- `appearance?: "atOnce" | "byClick"` - Message reveal mode (default: `"atOnce"`)
- `variant?: "chat" | "messenger"` - Visual style (default: `"chat"`)
- `className?: string` - Custom CSS classes

### `<Include>`

Embed another story passage within the current one.

```mdx
<!-- Include an MDX story -->

<Include storyId="common-intro" />

<!-- Include a TypeScript-defined story -->

<Include storyId="combat-system" />
```

**Props:**

- `storyId: string` - ID of the story passage to include (required)

### Dynamic Variables

Embed dynamic variables that are evaluated at runtime when the story is displayed.

#### Bare Expressions (Recommended)

```mdx
---
passageId: player-status
---

import { player } from "../entities/player";

# Hello, {player.name}!

You have {player.gold} gold coins and {player.inventory.length} items.

<Actions>
    <Action onPerform={() => console.log("test")}>Talk to {player.name}</Action>
</Actions>
```

#### `<Var>` Wrapper (Alternative)

```mdx
---
passageId: player-status
---

import { Var } from "@react-text-game/mdx";
import { player } from "../entities/player";

# Hello, <Var>{player.name}</Var>!

You have <Var>{player.gold}</Var> gold coins.
```

**Key Features:**

- **Runtime Evaluation**: Variables are evaluated when the story renders
- **IDE Support**: Full TypeScript autocomplete and type checking
- **Import Tracking**: IDE enforces proper imports for referenced variables
- **Works Everywhere**: Paragraphs, headers, Say bubbles, Action labels, etc.

**Expression Examples:**

```mdx
<!-- Simple property access -->

{player.name}

<!-- Nested properties -->

{player.stats.strength}

<!-- Calculations -->

{player.gold \* 2}

<!-- Method calls -->

{player.getTitle()}

<!-- Conditional expressions -->

{player.level >= 10 ? "Expert" : "Novice"}

<!-- Array/object methods -->

{player.inventory.map(item => item.name).join(", ")}
```

## Limitations & Best Practices

### Supported Components Only

**Only use components provided by `@react-text-game/mdx` or standard HTML/Markdown elements.** Custom React components are not supported.

**Supported:**

```mdx
<!-- Package components -->

<Action onPerform={() => {}}>Click</Action>
<Say>Hello</Say>
<Include storyId="intro" />

<!-- Standard HTML -->

<video src="video.mp4" />
<img src="image.png" />

<!-- Markdown syntax -->

# Header

![Image](image.png)
```

**Not supported:**

```mdx
<!-- Custom components will be ignored -->

<CustomButton onClick={() => {}}>Click</CustomButton>
<MyComponent />
```

### Unsupported HTML Elements

Only specific HTML elements are processed:

- `<img>` - Converted to `ImageComponent`
- `<video>` - Converted to `VideoComponent`

**All other HTML elements are ignored** and will not appear in the final story.

### Unsupported Props

The plugin only processes specific props for each component. **Unsupported props are silently ignored.**

See the [full API documentation](/api/mdx/) for complete prop specifications.

## Next Steps

- Explore the [MDX API documentation](/api/mdx/)
- Review the [Core Concepts](./core-concepts) for understanding game architecture
- Check out example MDX stories in the repository
