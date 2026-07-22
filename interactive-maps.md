---
title: Interactive maps
description: Place clickable hotspots and non-interactive mapImage decorations without breaking responsive coordinates.
---

# Interactive maps

An interactive map fits one source image inside the available container and positions every map entity by percentage. The same `{ x, y }` therefore targets the same source-image point on desktop and mobile.

```ts title="src/game/world-map.ts"
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
        {
            id: "ship-decoration",
            type: "mapImage",
            content: "/maps/ship.webp",
            position: { x: 41, y: 73 },
            props: { zoom: "12%", alt: "Ship at anchor" },
        },
    ],
});
```

## Coordinate contract

- `x: 0` is the left edge of the rendered map image and `x: 100` is the right edge.
- `y: 0` is the top edge and `y: 100` is the bottom edge.
- The entity is centered on that point with `translate(-50%, -50%)`.
- Letterboxing around a fitted image is excluded from the coordinate space.
- `zoom` is relative to the map's natural image size and scales with the fitted map.

Do not calculate positions from the browser viewport or outer passage container. Use the source artwork as the coordinate system and verify important targets at both wide and narrow aspect ratios.

## Clickable image hotspot

Use `type: "image"` when the image is a control. A string supplies one appearance; an object can supply interaction states:

```ts
{
    type: "image",
    content: {
        idle: "/map/chest.png",
        hover: "/map/chest-glow.png",
        active: "/map/chest-open.png",
        disabled: "/map/chest-locked.png",
    },
    position: { x: 62, y: 45 },
    props: { zoom: "18%" },
    action: openChest,
    isDisabled: () => !player.hasKey,
}
```

## Decorative map image

Use `type: "mapImage"` for artwork anchored to map coordinates. It deliberately has no `action`, disabled state, tooltip, pointer cursor, hover image, or pressed image. It is rendered as an image rather than a button and does not intercept pointer input.

```ts
{
    type: "mapImage",
    content: () => weather.isRaining
        ? "/map/rain-cloud.webp"
        : "/map/cloud.webp",
    position: () => ({ x: weather.cloudX, y: 18 }),
    props: {
        zoom: "25%",
        alt: "Cloud",
        classNames: {
            container: "opacity-80",
            image: "drop-shadow-lg",
        },
    },
}
```

Use a callable `content` or `position` when game state selects the artwork or location. Navigate to the same map again to display the new values.

## Side controls and menus

`sideLabel` and `sideImage` live in the top, right, bottom, or left rail rather than the map coordinate space. `menu` groups controls at one map position. Use these for inventory, travel lists, and controls whose visual size should not track the artwork.

See the [Core API](/api/core/) for every map type, class name, and option.
