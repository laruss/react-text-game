---
title: Loading and splash screens
description: Preload game assets, customize loading progress, and configure an interruptible splash sequence.
---

# Loading and splash screens

`GameProvider` owns one deterministic startup sequence:

```text
Game.init + preload content → loading screen → splash screens → game UI
```

Initialization and preloading run in parallel. The game UI is mounted only after both finish and the splash sequence completes.

## Preload game content

Pass the assets needed for the first playable scene. Strings are inferred by extension; image resources wait for browser decoding, while other resources are fetched and fully consumed.

```tsx title="src/main.tsx"
const preload = [
    "/maps/world.webp",
    "/audio/theme.ogg",
    {
        src: "/maps/world.webp",
        type: "image",
        srcSet: "/maps/world-640.webp 640w, /maps/world.webp 1280w",
        sizes: "100vw",
    },
] as const;

<GameProvider
    options={gameOptions}
    preload={preload}
    preloadConcurrency={4}
>
    <PassageController />
</GameProvider>;
```

The queue deduplicates source URLs, loads at most six resources concurrently by default, accepts an `AbortSignal` internally, and continues after individual asset failures. Progress counts completed resources, including failed resources, so a broken optional asset cannot trap the player on the loading screen.

Use a custom task when loading requires more than an HTTP request—for example, decoding Web Audio data:

```tsx
const preload = [
    {
        id: "battle-music-buffer",
        async load(signal: AbortSignal) {
            const response = await fetch("/audio/battle.ogg", { signal });
            const bytes = await response.arrayBuffer();
            await audioContext.decodeAudioData(bytes);
        },
    },
];
```

For a core-only application, call the same API directly:

```ts
import { preloadContent } from "@react-text-game/core";

const result = await preloadContent(preload, {
    concurrency: 4,
    signal: abortController.signal,
    onProgress: ({ completed, total, progress }) => {
        console.log({ completed, total, percentage: progress * 100 });
    },
});

console.log(result.failures);
```

Preload only resources required immediately or in the next likely scene. Eagerly requesting an entire game competes with critical page resources and wastes bandwidth. Use responsive `srcSet` and `sizes` for large images so the browser can select the right candidate. See the browser guidance for [responsive image preloading](https://web.dev/articles/preload-responsive-images), [`HTMLImageElement.decode()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode), and [abortable work](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

## Configure the loading screen

The default loading screen is rendered whenever `preload` is non-empty. It shows the React Text Game logo, `loading...`, and an accessible progress bar.

```tsx
<GameProvider
    options={gameOptions}
    preload={preload}
    loadingScreen={{
        backgroundImage: "/ui/loading-background.webp",
        text: [
            "Charting the world...",
            "Waking the characters...",
            "Preparing your story...",
        ],
        textInterval: 1800,
        progressTrackClassName: "h-1 bg-white/20",
        progressBarClassName: "bg-amber-300",
        progressBarStyle: { boxShadow: "0 0 16px #fcd34d" },
    }}
>
    <PassageController />
</GameProvider>
```

`text` accepts one string or an array. Array entries rotate with a fade animation. Style the container, logo, text, track, and indicator with class names or inline style objects.

Replace the complete loading screen through the component registry:

```tsx
import type { LoadingScreenProps } from "@react-text-game/ui";

function MyLoadingScreen({ progress }: LoadingScreenProps) {
    return (
        <MyFullScreenLayout>
            <MyProgress value={progress.progress} />
            <span>{progress.completed} / {progress.total}</span>
        </MyFullScreenLayout>
    );
}

const components = { LoadingScreen: MyLoadingScreen };

<GameProvider
    options={gameOptions}
    components={components}
    preload={preload}
>
    <PassageController />
</GameProvider>;
```

## Configure splash screens

In production, the built-in React Text Game splash is enabled by default. It lasts 1.5 seconds including fade-in and fade-out, and a click skips it immediately.

```tsx
const splashScreens = [
    {
        id: "publisher",
        content: <PublisherLogo />,
        duration: 2500,
    },
    {
        id: "legal",
        content: <LegalNotice />,
        duration: 4000,
        isInterruptible: false,
        className: "bg-slate-950 text-white",
    },
];

<GameProvider
    options={gameOptions}
    splashScreens={splashScreens}
>
    <PassageController />
</GameProvider>;
```

Durations are milliseconds and include both transitions. `isInterruptible` defaults to `true`. Interruptible screens use a semantic button, so pointer and keyboard activation both skip them.

| Option | Default | Effect |
| --- | --- | --- |
| `showSplashScreen` | `true` | Enables or disables the whole sequence |
| `showSplashScreenOnDev` | `false` | Allows the sequence when `options.isDevMode` is true |
| `showRTGSplashScreen` | `true` | Adds the built-in React Text Game screen first |
| `splashScreens` | `[]` | Adds custom screens after the built-in screen |

Disable the built-in screen and keep custom screens with `showRTGSplashScreen={false}`. Replace only its visual through `components.RTGSplashScreen`. Disable every splash with `showSplashScreen={false}`.

Loading text and splash transitions honor the operating-system [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion) setting. The default progress element also exposes the standard [`progressbar` semantics](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/progressbar_role).
