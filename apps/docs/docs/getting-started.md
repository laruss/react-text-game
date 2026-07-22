---
title: Installation
description: Install React Text Game and connect its styles to a React application.
---

# Installation

## Pick the packages you need

For the engine and the supplied React renderers:

```bash npm2yarn
npm install @react-text-game/core @react-text-game/ui
```

For a completely custom renderer, install only core:

```bash npm2yarn
npm install @react-text-game/core
```

Add MDX when narrative authors should work in Markdown-like files:

```bash npm2yarn
npm install @react-text-game/mdx @mdx-js/mdx @mdx-js/react
```

## Add the UI styles

The UI package uses Tailwind CSS v4. Import Tailwind and the library stylesheet from your global CSS entry:

```css title="src/styles.css"
@import "tailwindcss";
@import "@react-text-game/ui/styles";
```

Override semantic theme tokens after the imports when your game has its own palette:

```css title="src/styles.css"
@theme {
    --color-primary-500: oklch(0.62 0.22 275);
    --color-background: oklch(0.16 0.02 270);
}
```

## Register game modules before rendering

Entities and passages register as their modules are imported. Import a single registry from your client entry so a production bundler cannot omit game content:

```ts title="src/game/index.ts"
export * from "./entities/player";
export * from "./passages/intro";
export * from "./passages/forest";
```

```tsx title="src/main.tsx"
import "./game";
import "./styles.css";
```

`Game.init()` must finish before navigation or save operations. `GameProvider` handles that lifecycle for UI users. Core-only applications should call and await it directly.

In production, `GameProvider` displays the React Text Game splash by default. Development mode skips splash screens unless `showSplashScreenOnDev` is enabled. Add startup assets and customize the loading phase with the [loading and splash screen guide](/loading-and-splash-screens).

## Framework notes

- In Next.js, render `GameProvider` and game-dependent hooks from a Client Component.
- Do not initialize the same game independently on server and client.
- Keep `options` and custom component registries stable at module scope when possible.
- Set `isDevMode` to `false` in production; development mode intentionally exposes debugging helpers and disables session auto-save.

Continue with [Build your first game](/first-game), then use the [troubleshooting and architecture reference](/core-concepts) when you need deeper control.
