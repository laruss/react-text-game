# @react-text-game/ui

UI components library for react-text-game built with React 19, TypeScript, and Tailwind CSS v4.

> Install this package inside your own React project. It depends on `@react-text-game/core` for game state and Tailwind CSS v4 for styling tokens.

## Features

- Drop-in game shell: main menu, passage renderer, save/load modal, and dev helpers
- Tailwind CSS v4 theme tokens for full visual customization
- Language-aware UI copy powered by i18next with persistent language switching
- React hooks and context utilities that integrate directly with `@react-text-game/core`

## Installation

### 1. Install and configure Tailwind CSS

Follow the official Tailwind installation guide for your stack: [tailwindcss.com/docs/installation](https://tailwindcss.com/docs/installation).

### 2. Add react-text-game packages

```bash
# Bun (repo default)
bun add @react-text-game/core @react-text-game/ui

# npm
npm install @react-text-game/core @react-text-game/ui

# yarn
yarn add @react-text-game/core @react-text-game/ui
```

### 3. Import the UI theme tokens

Import the shared styles once in your global stylesheet (for example `src/index.css`, `src/main.css`, or whichever file you feed into your bundler):

```css
@import "@react-text-game/ui/styles";

@theme {
    --color-primary-500: oklch(0.65 0.25 265); /* optional override */
}
```

### Minimal implementation

Once Tailwind is wired up and packages are installed, the lightest viable setup only needs two pieces:

1. Wrap your React tree with `GameProvider` and pass the core engine options.
2. Render `PassageController` somewhere inside the provider.

```tsx
// src/App.tsx
import { GameProvider, PassageController } from "@react-text-game/ui";

export function App() {
    return (
        <GameProvider
            options={{ gameName: "My Text Adventure", isDevMode: true }}
        >
            <PassageController />
        </GameProvider>
    );
}
```

With those two components in place, the UI handles menus, passage rendering, and save/load modals. You can immediately start defining entities and passages through `@react-text-game/core`.

## Internationalization

The UI package ships with an `en` translation bundle for the `ui` namespace and exposes it through `@react-text-game/ui/i18n`. When you call `Game.init`, the core engine automatically merges these strings with your game resources and persists the active language for every player.

### Default UI copy

```ts
import { uiTranslations } from "@react-text-game/ui/i18n";

console.log(uiTranslations.en.ui.mainMenu.title); // "Main Menu"
```

Components such as `MainMenu`, `SaveLoadModal`, and `ErrorBoundary` already call `useTranslation('ui')`, so English works out of the box. You only need to add resources when you want to localize beyond the default language or override labels.

### Adding more languages

Create your own `ui` namespace JSON file per language and pass it alongside your story translations:

```ts
import uiEs from "./locales/es/ui.json";
import passagesEs from "./locales/es/passages.json";

await Game.init({
    gameName: "My Text Adventure",
    translations: {
        defaultLanguage: "en",
        fallbackLanguage: "en",
        resources: {
            es: {
                ui: uiEs,
                passages: passagesEs,
            },
        },
    },
});
```

- Any namespace you provide (including `ui`) overrides the defaults for that language.
- If you omit a translation key, i18next falls back to the language defined in `fallbackLanguage`.
- Because the core engine persists language preference in its settings store, players keep their choice on reload.

### Language toggle component

Use the built-in `LanguageToggle` to expose language switching in your UI. It relies on `useGameTranslation`, so language changes propagate everywhere.

```tsx
import { LanguageToggle } from "@react-text-game/ui";

function Header() {
    return (
        <header className="flex justify-end">
            <LanguageToggle
                languageNames={{ en: "English", es: "Español" }}
                showCode
            />
        </header>
    );
}
```

## Development

```bash
# Build once
bun run build

# Watch mode
bun run dev
```

## Theme Customization

This package uses **Tailwind CSS v4** with semantic color tokens that can be easily customized to match your game's design system.

### How It Works

All components use semantic color names (like `primary`, `secondary`, `success`, etc.) instead of hardcoded colors. This means you can completely customize the look and feel by overriding these color variables in your application.

### Available Semantic Colors

#### Brand Colors

- `primary-*` (50-950) - Main brand color
- `secondary-*` (50-950) - Secondary brand color

#### Semantic State Colors

- `success-*` (50-950) - Success states
- `warning-*` (50-950) - Warning states
- `danger-*` (50-950) - Error/danger states
- `info-*` (50-950) - Informational states

#### Neutral/UI Colors

- `muted-*` (50-950) - Muted/subtle UI elements
- `background` - Main background color
- `foreground` - Main text color
- `card` / `card-foreground` - Card backgrounds and text
- `popover` / `popover-foreground` - Popover backgrounds and text
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color
- `accent` / `accent-foreground` - Accent backgrounds and text
- `destructive` / `destructive-foreground` - Destructive action colors

### Customizing the Theme

You can override any theme color in your application's CSS file:

#### Example 1: Custom Brand Colors

```css
@import "@react-text-game/ui/styles";

@theme {
    /* Override primary brand color to purple */
    --color-primary-50: oklch(0.98 0.02 300);
    --color-primary-100: oklch(0.95 0.05 300);
    --color-primary-200: oklch(0.9 0.1 300);
    --color-primary-300: oklch(0.82 0.15 300);
    --color-primary-400: oklch(0.72 0.2 300);
    --color-primary-500: oklch(0.62 0.24 300);
    --color-primary-600: oklch(0.52 0.22 300);
    --color-primary-700: oklch(0.44 0.18 300);
    --color-primary-800: oklch(0.36 0.14 300);
    --color-primary-900: oklch(0.28 0.1 300);
    --color-primary-950: oklch(0.18 0.06 300);
}
```

#### Example 2: Complete Custom Theme

```css
@import "@react-text-game/ui/styles";

@theme {
    /* Replace entire color palette */
    --color-*: initial;

    /* Custom brand colors */
    --color-primary-500: oklch(0.65 0.25 265);
    --color-secondary-500: oklch(0.7 0.2 180);

    /* Custom UI colors */
    --color-background: oklch(0.98 0.002 264);
    --color-foreground: oklch(0.2 0.01 264);
    --color-border: oklch(0.88 0.005 264);

    /* Success/Error colors */
    --color-success-500: oklch(0.65 0.18 150);
    --color-danger-500: oklch(0.65 0.22 30);
}
```

#### Example 3: Dark Mode Custom Colors

```css
@import "@react-text-game/ui/styles";

/* Override dark mode colors */
@media (prefers-color-scheme: dark) {
    @theme {
        --color-background: oklch(0.1 0.01 264);
        --color-foreground: oklch(0.95 0.002 264);
        --color-primary-500: oklch(0.7 0.25 265);
    }
}
```

### Using in Your Application

1. **Import the styles** in your main CSS file:

```css
@import "@react-text-game/ui/styles";

/* Your custom theme overrides here */
@theme {
    --color-primary-500: your-custom-color;
}
```

1. **Import components** in your React code:

```tsx
import { Button, MainMenu, StoryComponent } from "@react-text-game/ui";
```

### Custom Component Overrides

You can override any built-in component with your own implementation using the `ComponentsProvider`:

```tsx
import {
    GameProvider,
    ComponentsProvider,
    type Components,
} from "@react-text-game/ui";

// Create your custom components
const CustomHeading = ({ text }: { text: string }) => (
    <h1 className="text-4xl font-bold my-custom-class">{text}</h1>
);

const CustomMainMenu = () => (
    <div className="my-custom-menu">
        {/* Your custom menu implementation */}
    </div>
);

// Define which components to override
const customComponents: Components = {
    MainMenu: CustomMainMenu,
    story: {
        Heading: CustomHeading,
        // Text, Image, Video, Actions, Conversation can also be overridden
    },
};

// Wrap your game with ComponentsProvider
function App() {
    return (
        <GameProvider>
            <ComponentsProvider components={customComponents}>
                {/* Your game content */}
            </ComponentsProvider>
        </GameProvider>
    );
}
```

**Available component overrides:**

- `MainMenu` - Main game menu
- `story.Heading` - Story passage heading
- `story.Text` - Story text content
- `story.Image` - Story images
- `story.Video` - Story videos
- `story.Actions` - Story action buttons
- `story.Conversation` - Story conversation dialogs

Any components not specified will use the default implementation.

### Color Format: oklch()

This package uses the `oklch()` color format from Tailwind CSS v4, which provides:

- **Perceptually uniform** colors
- **Better dark mode** transitions
- **Predictable lightness** control

Format: `oklch(lightness chroma hue)`

- `lightness`: 0-1 (0 = black, 1 = white)
- `chroma`: 0-0.4 (saturation intensity)
- `hue`: 0-360 (color angle)

Use [oklch.com](https://oklch.com) to pick and convert colors.

### Component Customization

Components also accept `className` props for additional styling:

```tsx
<Button variant="solid" color="primary" className="custom-additional-styles">
    Click me
</Button>
```

### Tips

1. **Start small**: Override just `primary-500` and `secondary-500` to quickly brand your game
2. **Use the scale**: The `-50` to `-950` scale provides consistent light/dark variants
3. **Test dark mode**: Always test your custom colors in both light and dark modes
4. **Maintain contrast**: Ensure sufficient contrast between foreground and background colors

## ⚠️ Theme Variable Conflicts

### Potential Issue

This package uses **global CSS variables** (like `--color-primary-500`, `--color-background`, etc.) that may conflict with other design systems if you're mixing multiple component libraries.

**Example conflict:**

```css
/* Both systems try to define the same variables */
@import "@react-text-game/ui/styles"; /* Uses --color-primary-500 */
@import "@shadcn/ui/styles"; /* Also uses --color-primary-500 */

@theme {
    --color-primary-500: oklch(...); /* Which library does this affect? Both! */
}
```

### Solutions

#### Option 1: Use as Primary Design System (Recommended)

This package is designed to be your **primary UI system** for game interfaces. If you're building a game, use `@react-text-game/ui` as your main component library and avoid mixing with other design systems.

#### Option 2: Scope Your Game UI

If you **must** mix with other design systems (e.g., using shadcn for admin panels and our UI for the game), wrap the game in a dedicated container:

```tsx
// App.tsx
import "@react-text-game/ui/styles";

function App() {
    return (
        <>
            {/* Admin UI with shadcn */}
            <AdminPanel />

            {/* Game UI isolated in a scope */}
            <div className="game-container">
                <GameProvider>{/* Our components here */}</GameProvider>
            </div>
        </>
    );
}
```

Then create scoped overrides:

```css
/* app.css */
@import "@react-text-game/ui/styles";

/* Scoped theme for game only */
.game-container {
    /* Override game theme variables specifically */
    --color-primary-500: oklch(0.65 0.25 300);
    --color-background: oklch(0.05 0.01 280);
}
```

#### Option 3: CSS Layers for Priority Control

Use CSS `@layer` to control which system takes precedence:

```css
@import "@react-text-game/ui/styles" layer(game-ui);
@import "@shadcn/ui/styles" layer(admin-ui);

/* Define layer priority */
@layer game-ui, admin-ui;

/* game-ui variables will override admin-ui */
```

#### Option 4: Manual Variable Remapping (Advanced)

If you need fine-grained control, manually remap variables:

```css
@import "@react-text-game/ui/styles";

@theme {
    /* Remap our variables to avoid conflicts */
    --rtg-primary: var(--color-primary-500);
    --rtg-background: var(--color-background);
}
```

Then create wrapper components:

```tsx
// CustomButton.tsx
import { Button as RTGButton } from "@react-text-game/ui";

export const GameButton = (props) => (
    <div
        style={{
            "--color-primary-500": "var(--rtg-primary)",
            "--color-background": "var(--rtg-background)",
        }}
    >
        <RTGButton {...props} />
    </div>
);
```

### Best Practices

✅ **DO**: Use this as your primary design system for game UIs
✅ **DO**: Override theme variables at the root for global customization
✅ **DO**: Use scoped containers when mixing with other libraries
❌ **DON'T**: Mix multiple design systems in the same view without scoping
❌ **DON'T**: Import multiple `@theme` definitions at the same level without layers

## Components

### Core Components

- `Button` - Customizable button with multiple variants (solid, faded, bordered, light, flat, ghost, shadow)
- `Spinner` - Loading spinner
- `GameProvider` - Main game wrapper with dev tools
- `ComponentsProvider` - Provider for custom component overrides (new in 0.2.0)
- `MainMenu` - Game menu with save/load functionality
- `StoryComponent` - Story passage renderer
- `InteractiveMapComponent` - Interactive map renderer
- `SaveLoadModal` - Save/Load game modal
- `Tooltip` - Tooltip component

### Story Components (Overridable)

- `Heading` - Story passage heading (formerly `Header`)
- `Text` - Story text content
- `Image` - Story images
- `Video` - Story videos
- `Actions` - Story action buttons
- `Conversation` - Story conversation dialogs

### Hooks & Context

- `useSaveLoadMenu` - Hook to control save/load modal (exported from main package)

## License

MIT
