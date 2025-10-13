# @react-text-game/mdx

MDX integration package for React Text Game engine. This package enables you to write game passages using MDX (Markdown + JSX), allowing you to combine narrative content with interactive React components in a seamless, author-friendly format.

## Why MDX?

- **Author-friendly**: Write game content in familiar Markdown syntax
- **Component integration**: Embed React components directly in your narrative
- **Type-safe**: Full TypeScript support for your custom components
- **Vite integration**: Optimized build pipeline with Vite plugin
- **Structured data extraction**: Automatically extract metadata and story structure from MDX files

## Quick Start

### Installation

Install the package along with its peer dependencies:

```bash
# Using Bun
bun add @react-text-game/mdx @react-text-game/core @mdx-js/mdx @mdx-js/react

# Using npm
npm install @react-text-game/mdx @react-text-game/core @mdx-js/mdx @mdx-js/react

# Using yarn
yarn add @react-text-game/mdx @react-text-game/core @mdx-js/mdx @mdx-js/react

# Using pnpm
pnpm add @react-text-game/mdx @react-text-game/core @mdx-js/mdx @mdx-js/react
```

### Setup

This package provides an MDX plugin that works with any MDX-compatible bundler.

#### With Vite

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

#### With Other Bundlers

Follow the [MDX installation guide](https://mdxjs.com/docs/getting-started/) for your bundler, then pass `reactTextGameStoryPlugin()` as an option to the MDX compiler:

```javascript
import { compile } from '@mdx-js/mdx';
import { reactTextGameStoryPlugin } from '@react-text-game/mdx/plugin';

await compile(mdxSource, { ...reactTextGameStoryPlugin() });
```

### Basic Usage

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
export * from './stories';

// src/main.tsx
import "./game/registry";
```

### Advanced Example

Here's a more complex story demonstrating all available components:

```mdx
---
passageId: adventure-start
---
import { Action, Actions, Conversation, Say, Include } from "@react-text-game/mdx";
import { player } from "../entities/player";

# The Grand Adventure

{player.name}, you stand at the entrance of an ancient temple. Strange symbols glow on the walls.

![Temple Entrance](./assets/temple.png "The Ancient Temple")

<video src="./assets/temple-ambience.mp4" />

<Conversation>
    <Say>What is this place?</Say>
    <Say>The markings... they're unlike anything I've seen before.</Say>
    <Say>I should proceed carefully.</Say>
</Conversation>

<Actions>
    <Action onPerform={() => console.log("Examining symbols")}>
        Examine the symbols closely
    </Action>
    <Action onPerform={() => console.log("Entering temple")}>
        Enter the temple
    </Action>
    <Action onPerform={() => console.log("Walking away")}>
        Walk away
    </Action>
</Actions>

<Include storyId="temple-lore" />
```

## Components Reference

The MDX package provides JSX components that map to the core game engine's story components. All core component types are supported through either direct MDX components or standard Markdown/HTML syntax.

### Text & Headers

Standard Markdown text and headers are automatically converted to the appropriate core components:

```mdx
# Header Level 1
## Header Level 2
### Header Level 3

Regular paragraph text becomes a text component.
```

**Maps to:** `TextComponent` and `HeaderComponent` from `@react-text-game/core`

### Images & Video

Use standard Markdown image syntax or HTML elements:

```mdx
![Alt text](./image.png "Image title")

<img src="./image.png" alt="Alt text" />

<video src="./video.mp4" />
```

**Maps to:** `ImageComponent` and `VideoComponent` from `@react-text-game/core`

### `<Actions>` and `<Action>`

Container for interactive action buttons. Each `<Action>` represents a clickable choice.

```mdx
<Actions>
    <Action onPerform={() => alert("Action 1")}>
        First Choice
    </Action>
    <Action
        onPerform={() => Game.jumpTo("chapter2")}}
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
- `tooltip?: object` - Tooltip configuration with `content`, `position`, and `className`
- `className?: string` - Custom CSS classes

**Props for `<Actions>`:**
- `direction?: "horizontal" | "vertical"` - Layout direction (default: `"horizontal"`)
- `className?: string` - Custom CSS classes

**Maps to:** `ActionsComponent` and `ActionType` from `@react-text-game/core`

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
- `classNames?: object` - CSS class overrides for `base`, `content`, and `avatar`

**Props for `<Conversation>`:**
- `appearance?: "atOnce" | "byClick"` - Message reveal mode (default: `"atOnce"`)
- `variant?: "chat" | "messenger"` - Visual style (default: `"chat"`)
- `className?: string` - Custom CSS classes

**Maps to:** `ConversationComponent` and `ConversationBubble` from `@react-text-game/core`

### `<Include>`

Embed another story passage within the current one. You can include any registered story passage in the game, whether it's defined in a TypeScript file (using `newStory()` from `@react-text-game/core`) or another MDX file.

```mdx
<!-- Include an MDX story -->
<Include storyId="common-intro" />

<!-- Include a TypeScript-defined story -->
<Include storyId="combat-system" />
```

**Props:**
- `storyId: string` - ID of the story passage to include (required). The story must be registered with the game engine.

**Maps to:** `AnotherStoryComponent` from `@react-text-game/core`

### Dynamic Variables

Embed dynamic variables that are evaluated at runtime when the story is displayed. This allows you to show game state, player properties, or any JavaScript expression directly in your text content.

**Two syntaxes are supported:**

#### 1. **Bare Expressions** (Recommended - Concise)
```mdx
---
passageId: player-status
---
import { player } from '../entities/player';
import { Game } from '@react-text-game/core';

# Hello, {player.name}!

You have {player.gold} gold coins and {player.inventory.length} items.

<Conversation>
    <Say>What are you doing, {player.name}?</Say>
</Conversation>

<Actions>
    <Action onPerform={() => console.log("test")}>
        Talk to {player.name}
    </Action>
</Actions>
```

#### 2. **`<Var>` Wrapper** (Explicit Alternative)
```mdx
---
passageId: player-status
---
import { Var } from "@react-text-game/mdx";
import { player } from '../entities/player';

# Hello, <Var>{player.name}</Var>!

You have <Var>{player.gold}</Var> gold coins.
```

**Key Features:**
- **Runtime Evaluation**: Variables are evaluated when the story renders, not at compile time
- **IDE Support**: Full TypeScript autocomplete and type checking (because you import the variables)
- **Import Tracking**: IDE enforces proper imports for referenced variables
- **Dynamic Content**: Access game state, player properties, calculations, etc.
- **Works Everywhere**: Paragraphs, headers, Say bubbles, Action labels, etc.

**Expression Examples:**

```mdx
<!-- Simple property access -->
{player.name}

<!-- Nested properties -->
{player.stats.strength}

<!-- Calculations -->
{player.gold * 2}

<!-- Method calls -->
{player.getTitle()}

<!-- Conditional expressions -->
{player.level >= 10 ? "Expert" : "Novice"}

<!-- Array/object methods -->
{player.inventory.map(item => item.name).join(", ")}
```

**Important Notes:**
- Variables **must be imported** at the top of the MDX file
- Expressions are evaluated in the story's render context
- TypeScript will validate your variable paths
- Can be used inline within paragraphs, headers, components, and other text content

**Maps to:** Template literals in the compiled output, evaluated at runtime

## Limitations & Best Practices

### Supported Components Only

**Only use components provided by `@react-text-game/mdx` or standard HTML/Markdown elements.** Custom React components are not supported and will be ignored during compilation.

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

Only specific HTML elements are processed by the plugin:
- `<img>` - Converted to `ImageComponent`
- `<video>` - Converted to `VideoComponent`

**All other HTML elements (like `<div>`, `<span>`, `<button>`, etc.) are ignored** and will not appear in the final story. Use standard Markdown syntax for text formatting instead.

**Example:**
```mdx
<!-- ❌ This will be ignored -->
<div className="container">
  <span>Text</span>
</div>

<!-- ✅ Use Markdown instead -->
Regular text with **bold** and *italic* formatting.
```

### Unsupported Props

The plugin only processes specific props for each component. **Unsupported props are silently ignored.**

**For `<Say>` component:**
- ✅ Supported: `who`, `side`, `color`, `classNames`
- ❌ Ignored: Any other props (e.g., `className`, `style`, `id`)

**For `<Conversation>` component:**
- ✅ Supported: `appearance`, `variant`, `className`
- ❌ Ignored: Any other props

**For `<Action>` component:**
- ✅ Supported: `onPerform`, `color`, `variant`, `isDisabled`, `tooltip`, `className`
- ❌ Ignored: Any other props

**For `<Actions>` component:**
- ✅ Supported: `direction`, `className`
- ❌ Ignored: Any other props

**For HTML elements:**
- `<img>`: Supported props are `src`, `alt`, `title`, `className`, `disableModal`, `onClick`
- `<video>`: Supported props are `src`, `className`, `controls`, `autoPlay`, `loop`, `muted`

**Example:**
```mdx
<!-- ❌ 'style' and 'id' will be ignored -->
<Say style={{ color: 'red' }} id="greeting">Hello</Say>

<!-- ✅ Use supported props instead -->
<Say color="#ff0000">Hello</Say>
```
