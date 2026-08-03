# GameProvider, bootstrap, and UI slots

## Contents

- Wrapping the application
- Which props are read once
- The bootstrap sequence
- Splash screens run per tab, not per load
- Preloading assets
- Replacing UI through slots
- Writing a replacement renderer

## Wrapping the application

Create one stable root wrapper and let it own initialization, preloading, loading UI, splash screens, component overrides, and the dev tools.

```tsx
import type { NewOptions } from "@react-text-game/core";
import { GameProvider, PassageController } from "@react-text-game/ui";
import "@react-text-game/ui/styles";
import "./game/registry";

const gameOptions = {
    gameName: "Forest Walk",
    gameId: "forest-walk",
    gameVersion: "1.0.0",
    startPassage: "intro",
    isDevMode: import.meta.env.DEV,
} satisfies NewOptions;

const preload = ["/maps/forest.webp", "/audio/theme.ogg"] as const;

export function GameApp() {
    return (
        <GameProvider options={gameOptions} preload={preload} showSplashScreenOnDev>
            <PassageController />
        </GameProvider>
    );
}
```

`GameProviderProps`: `options` (required), `components`, `loadingScreen`, `preload`, `preloadConcurrency`, `onPreloadComplete`, `showSplashScreen`, `showRTGSplashScreen`, `showSplashScreenOnDev`, `splashScreens`.

## Which props are read once

`GameProvider` captures most props on first render and never reads them again. Changing them later has no effect:

- read once: `preload`, `preloadConcurrency`, `onPreloadComplete`, `splashScreens`, `showSplashScreen`, `showRTGSplashScreen`, `showSplashScreenOnDev`, and `components.MainMenu`.
- applied on change: `options`, forwarded to `Game.updateOptions()`.
- live: `components`, passed straight through to the components context on every render.

Declare the read-once values at module scope. An inline array or object literal in JSX is a new reference on every render, which is wasted work at best and confusing at worst, since the change is silently ignored.

## The bootstrap sequence

The order is fixed:

1. `Game.init(options)` and `preloadContent(preload)` start **in parallel**.
2. While they run, the loading screen shows if `preload` is non-empty; otherwise nothing renders.
3. When both settle: `onPreloadComplete` fires, failures are warned to the console, and the start-menu widget is registered from `components.MainMenu` or the built-in `MainMenu`.
4. If nothing has set a current passage yet, `startPassage` is resolved. An unknown id warns and falls back to the start menu.
5. Splash screens run, if wanted for this tab.
6. Only then does game UI mount, wrapped in an error boundary, the components context, and the save/load menu context.

Consequences worth respecting:

- Do not start a competing preload effect in a child. Children are not mounted until step 6, so their effects cannot contribute to the loading phase.
- Do not call `Game.init()` anywhere below the provider.
- A passage registered during module evaluation is available by step 4; one registered inside a child component is not.

## Splash screens run per tab, not per load

Splash screens show once per browser tab, tracked with a `sessionStorage` marker. A freshly opened tab shows them; an in-tab reload does not. When testing a splash sequence, open a new tab or clear the marker -- reloading will not replay it.

Splashes also require `showSplashScreen`, at least one screen (`showRTGSplashScreen` or a non-empty `splashScreens`), and, in dev mode, `showSplashScreenOnDev`. `SplashScreenConfig` takes `content`, `duration` in milliseconds including fades, `isInterruptible` (default true), `id`, `className`, and `style`. Keep interruptible screens skippable by pointer and keyboard, and honour reduced-motion preferences.

## Preloading assets

- A `PreloadAsset` is a URL string, a `{ src, type }` source (`"auto" | "image" | "fetch"`), or a custom `{ id, load(signal) }` task for application-specific decoding.
- `PreloadProgress.progress` counts completed **items**, not bytes.
- Individual failures are reported and still advance completion, so optional content cannot deadlock startup.
- Preload the first playable scene and the likely next one. Keep the default bounded concurrency unless a measurement justifies changing it.
- Replace the whole loading UI through the `LoadingScreen` slot. `LoadingScreenOptions` covers `text` (a string or a rotating list with `textInterval`), `backgroundImage`, and class names and styles for the container, logo, progress bar, and track. Preserve `progressbar` semantics in a custom version.

## Replacing UI through slots

Prefer composition over forking internals:

```tsx
const components = {
    story: { Heading: GameHeading, Actions: GameActions },
    passages: { InteractiveMap: GameMap, Empty: GameEmptyState },
};

<GameProvider options={gameOptions} components={components}>
    <PassageController />
</GameProvider>;
```

Story slots: `Heading`, `Text`, `Image`, `Video`, `Actions`, `Conversation`. Passage slots: `Story`, `InteractiveMap`, `Widget`, `Empty`, `Unknown`. Top level also has `MainMenu`, `LoadingScreen`, and `RTGSplashScreen`. Unspecified slots keep their defaults.

If the application already owns every presentation primitive, drop `@react-text-game/ui` entirely and drive the engine through core hooks.

## Writing a replacement renderer

- Consume the public passage and component prop types.
- Resolve callable fields at display time and keep navigation-driven refresh intact: the passage must re-render when `renderId` changes, including a jump to the passage already on screen.
- Preserve semantic controls, focus behaviour, and keyboard interaction.
- Reproduce the map coordinate contract exactly when rendering interactive maps -- see [interactive-maps.md](interactive-maps.md).
- Style with the semantic colour tokens from `@react-text-game/ui/styles`. Never hardcode palette colours such as `bg-blue-500`.
