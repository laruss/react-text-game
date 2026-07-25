---
title: Interactive maps
description: Place clickable hotspots and non-interactive mapImage decorations without breaking responsive coordinates.
---

# Interactive maps

An interactive map fits one source image inside the available container and positions every map entity by percentage. The same `{ x, y }` therefore targets the same source-image point on desktop and mobile.

```ts title="src/game/world-map.ts"
import { defineInteractiveMap } from "@react-text-game/core";

export const worldMap = defineInteractiveMap(
    "world-map",
    (h) => [
        h.label("Harbor", {
            id: "harbor",
            position: { x: 24, y: 68 },
            action: h.jump("harbor"),
        }),
        h.mapImage("/maps/ship.webp", {
            id: "ship-decoration",
            position: { x: 41, y: 73 },
            zoom: "12%",
            alt: "Ship at anchor",
        }),
    ],
    { image: "/maps/world.webp" }
);
```

The hotspots come from the content callback; the image, caption, and styling stay in the options object. `h` is the map helper toolbox: `h.label`, `h.image`, `h.mapImage` and `h.menu` build hotspots, `h.jump(passageId)` builds a navigation handler, and `h.when(condition, value)` builds a conditional one. Falsy entries are dropped, so a hotspot can be gated inline with `player.hasKey && h.label(...)`.

Options are flat: `zoom`, `alt`, `color`, `variant` and `classNames` are written at the top level even though they live under `props` in the raw hotspot type.

## Coordinate contract

- `x: 0` is the left edge of the rendered map image and `x: 100` is the right edge.
- `y: 0` is the top edge and `y: 100` is the bottom edge.
- The entity is centered on that point with `translate(-50%, -50%)`.
- Letterboxing around a fitted image is excluded from the coordinate space.
- `zoom` is relative to the map's natural image size and scales with the fitted map.

Do not calculate positions from the browser viewport or outer passage container. Use the source artwork as the coordinate system and verify important targets at both wide and narrow aspect ratios.

## Clickable image hotspot

Use `h.image` when the image is a control. A string supplies one appearance; an object can supply interaction states:

```ts
h.image(
    {
        idle: "/map/chest.png",
        hover: "/map/chest-glow.png",
        active: "/map/chest-open.png",
        disabled: "/map/chest-locked.png",
    },
    {
        position: { x: 62, y: 45 },
        zoom: "18%",
        action: openChest,
        isDisabled: () => !player.hasKey,
    }
)
```

## Decorative map image

Use `h.mapImage` for artwork anchored to map coordinates. It deliberately has no `action`, disabled state, tooltip, pointer cursor, hover image, or pressed image. It is rendered as an image rather than a button and does not intercept pointer input.

```ts
h.mapImage(
    () => (weather.isRaining ? "/map/rain-cloud.webp" : "/map/cloud.webp"),
    {
        position: () => ({ x: weather.cloudX, y: 18 }),
        zoom: "25%",
        alt: "Cloud",
        classNames: {
            container: "opacity-80",
            image: "drop-shadow-lg",
        },
    }
)
```

Use a callable `content` or `position` when game state selects the artwork or location. Navigate to the same map again to display the new values.

## Side controls and menus

Pass `position: "top" | "right" | "bottom" | "left"` to `h.label` or `h.image` to place a control in that rail rather than in the map coordinate space. `h.menu` groups controls at one map position. Use these for inventory, travel lists, and controls whose visual size should not track the artwork.

```ts
h.menu(
    [
        h.label("Inventory", { action: h.jump("inventory") }),
        player.hasShip && h.label("Set sail", { action: h.jump("voyage") }),
    ],
    { position: { x: 50, y: 90 }, direction: "horizontal" }
)
```

Menu items omit `position` — the menu positions them. A position-less `h.label` is rejected by the type system anywhere a standalone hotspot is expected, so the two uses cannot be confused.

## Passing the options object directly

`newInteractiveMap` remains fully supported and takes the whole configuration — hotspots included — as one object:

```ts
import { Game, newInteractiveMap } from "@react-text-game/core";

export const worldMap = newInteractiveMap("world-map", {
    image: "/maps/world.webp",
    hotspots: [
        {
            id: "harbor",
            type: "label",
            content: "Harbor",
            position: { x: 24, y: 68 },
            action: () => Game.jumpTo("harbor"),
        },
        // conditional hotspots use a callback returning undefined
        () =>
            player.hasKey
                ? {
                      type: "label",
                      content: "Vault",
                      position: { x: 80, y: 30 },
                      action: () => Game.jumpTo("vault"),
                  }
                : undefined,
    ],
});
```

Both factories produce the same `InteractiveMap`, so a project can migrate one map at a time.

See the [Core API](/api/core/) for every map type, class name, and option.
