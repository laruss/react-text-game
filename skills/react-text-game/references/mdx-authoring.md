# Authoring stories in MDX

## Contents

- Wiring the plugin
- File shape
- Components
- Registration
- Constraints

## Wiring the plugin

MDX stories need the processor options from `@react-text-game/mdx/plugin`, applied to the MDX bundler plugin:

```ts
// vite.config.ts
import mdx from "@mdx-js/rollup";
import { reactTextGameStoryPlugin } from "@react-text-game/mdx/plugin";

export default {
    plugins: [
        { enforce: "pre", ...mdx({ ...reactTextGameStoryPlugin() }) },
        react(),
    ],
};
```

`enforce: "pre"` and the position before the React plugin both matter: the MDX transform has to run first. Without the plugin options, an `.mdx` file compiles to an ordinary React component and no passage is registered.

## File shape

Frontmatter supplies the passage id. Markdown maps to story components: headings become headers, paragraphs become text, images and video become the media components.

```mdx
---
passageId: intro
---

import { Actions, Action, Conversation, Say, Include, Var } from "@react-text-game/mdx";

# At the forest edge

The path narrows between two black pines.

Courage: <Var>{player.courage}</Var>

<Conversation appearance="byClick" variant="messenger">
    <Say who={{ name: "Guide", avatar: "/avatars/guide.webp" }}>
        Stay close to the lantern.
    </Say>
    <Say side="right">Understood.</Say>
</Conversation>

<Actions>
    <Action onPerform={() => Game.jumpTo("forest")}>Enter the forest</Action>
</Actions>

<Include storyId="shared-outro" />
```

## Components

| Component | Purpose | Key props |
| --- | --- | --- |
| `Actions` / `Action` | choice buttons | `Action` takes `onPerform` plus the non-content fields of the core action type (`color`, `variant`, `isDisabled`, `tooltip`, `className`) |
| `Conversation` / `Say` | dialogue | `Conversation` takes `appearance` and `variant`; `Say` takes `who`, `side`, `color`, and `classNames` |
| `Include` | embed another registered story | `storyId` |
| `Var` | runtime-evaluated expression inside prose | wraps a single expression as children |

`Action` uses `onPerform`, not `action`. Everything mutating belongs there, never in the body of the file -- the same rule as any other passage, see [side-effects.md](side-effects.md).

## Registration

Importing the file registers the story:

```ts
import "./stories/intro.mdx";          // registers only
import introStory from "./stories/intro.mdx"; // registers and exposes the Story instance
```

Add MDX stories to the game registry module alongside the TypeScript ones so import order stays predictable.

## Constraints

- These components are **compile-time only**. They are transformed into core story components during the MDX build and do nothing useful in a `.tsx` file. Never import them into regular React code.
- A `passageId` in frontmatter is a persistent identifier. Renaming it breaks saves and any `Include` or `jump` that referenced it.
- `Include` requires the target story to be registered. Import the included file too, or the reference resolves to nothing at render time.
- Keep expressions in `Var` cheap and side-effect free; they run during display.
