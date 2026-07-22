---
title: Custom UI
description: Replace React Text Game primitives or complete passage renderers with your own components.
---

# Custom UI

Core has no dependency on the supplied presentation. You can build directly on its hooks, or use `GameProvider` and replace only the pieces that belong to your design system.

## Replace one story primitive

Pass a stable component registry to `GameProvider`. Unspecified slots keep their defaults.

```tsx title="src/game-ui.tsx"
import type { HeadingProps } from "@react-text-game/ui";
import { GameProvider, PassageController } from "@react-text-game/ui";

function GameHeading({ component }: HeadingProps) {
    return (
        <h2 className="font-display text-4xl text-amber-200">
            {typeof component.content === "function"
                ? component.content()
                : component.content}
        </h2>
    );
}

const components = {
    story: { Heading: GameHeading },
};

export function GameUI() {
    return (
        <GameProvider options={gameOptions} components={components}>
            <PassageController />
        </GameProvider>
    );
}
```

Story primitive slots are `Heading`, `Text`, `Image`, `Video`, `Actions`, and `Conversation`.

## Replace bootstrap screens

`LoadingScreen` receives live preload progress. `RTGSplashScreen` replaces only the built-in brand screen; custom entries still come from the `splashScreens` prop.

```tsx
import type { LoadingScreenProps } from "@react-text-game/ui";

function LoadingScreen({ progress }: LoadingScreenProps) {
    return <MyLoader value={progress.progress} />;
}

const components = {
    LoadingScreen,
    RTGSplashScreen: () => <MyEngineCredit />,
};
```

See [Loading and splash screens](/loading-and-splash-screens) for the complete lifecycle and configuration.

## Replace a complete passage renderer

Passage slots let an application own its layout while retaining initialization, navigation, save UI, and error boundaries:

```tsx
import type { InteractiveMapComponentProps } from "@react-text-game/ui";

function MyMap({ interactiveMap }: InteractiveMapComponentProps) {
    const scene = interactiveMap.display();

    return (
        <MyMapCanvas
            image={scene.image}
            entities={scene.hotspots}
        />
    );
}

const components = {
    passages: {
        InteractiveMap: MyMap,
        Empty: () => <MyEmptyState />,
    },
};
```

Available passage slots are `Story`, `InteractiveMap`, `Widget`, `Empty`, and `Unknown`. The `MainMenu` slot replaces the default start menu. Bootstrap slots are `LoadingScreen` and `RTGSplashScreen`.

## Build without the UI package

Core hooks expose engine state without imposing markup:

```tsx
import { useCurrentPassage } from "@react-text-game/core";

export function MyPassageRouter() {
    const passage = useCurrentPassage();

    if (!passage) return <MyEmptyState />;

    switch (passage.type) {
        case "story":
            return <MyStory passage={passage} />;
        case "interactiveMap":
            return <MyMap passage={passage} />;
        case "widget":
            return passage.display();
    }
}
```

This is the cleanest option when your application already has its own modal, button, animation, and accessibility primitives.

## Component contract

- Treat passage objects as inputs; keep persistent game state in entities.
- Resolve callable fields when the passage is displayed, not in module scope.
- Preserve map percentage coordinates if you replace the map renderer.
- Use semantic elements for actions. A clickable image hotspot should remain a button; `mapImage` should remain non-interactive.
- Memoize a large `components` object in application code if it is constructed from runtime values. Module-level registries need no memoization.

Exact props are listed in the [UI API](/api/ui/).
