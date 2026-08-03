# Interactive map coordinates

## Contents

- The coordinate contract
- Finding coordinates while authoring
- Edge rails
- Zoom
- Resize behaviour
- Writing a custom map renderer
- Verification checklist

## The coordinate contract

Hotspot positions are percentages of the **fitted map image**, not of the viewport and not of the outer passage container. The image is scaled to fit its container while preserving aspect ratio, then centred, which leaves letterbox bars on one axis.

```ts
scaleFactor  = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight);
scaledWidth  = naturalWidth * scaleFactor;
scaledHeight = naturalHeight * scaleFactor;
offsetLeft   = (containerWidth - scaledWidth) / 2;
offsetTop    = (containerHeight - scaledHeight) / 2;

left      = offsetLeft + (x / 100) * scaledWidth;
top       = offsetTop + (y / 100) * scaledHeight;
transform = "translate(-50%, -50%)";
```

The `translate(-50%, -50%)` is what makes `{ x, y }` mean the hotspot's **centre**. Dropping it silently shifts every hotspot by half its own size, which reads as "slightly off" rather than as a bug.

## Finding coordinates while authoring

In dev mode, clicking the map image logs and copies the clicked position to the clipboard as `{ x: 42.13, y: 68.04 }`, ready to paste into a hotspot. Use it instead of estimating coordinates from an image editor, whose pixel coordinates do not account for the fit and offset.

## Edge rails

`position` selects the coordinate space:

- `{ x, y }` -- percentages on the fitted image (`MapLabelHotspot`, `MapImageHotspot`, `MapImage`).
- `"top" | "right" | "bottom" | "left"` -- an edge rail **outside** the map coordinate space (`SideLabelHotspot`, `SideImageHotspot`).

Rail elements are not affected by the fit maths above. Do not try to convert between the two spaces; pick the one that matches the intent.

## Zoom

Custom image zoom multiplies the element's visual size **in addition to** the fitted-image scale. Applying zoom must not move the anchor point: the hotspot centre stays on the same `{ x, y }` while the artwork grows around it.

## Resize behaviour

- Recalculate after the image's `load` event and on every container resize.
- Use a single `ResizeObserver` on the container. Do not add global `resize` listeners in parallel with it.
- Keep the recalculation idempotent: compare the newly computed geometry against the current one and skip the state update when every field matches, or the observer will loop.
- Absolute-positioned wrappers may stay pointer-transparent, but the controls inside them must remain pointer-interactive.

## Writing a custom map renderer

When replacing the `InteractiveMap` passage slot:

- Consume the public passage and hotspot types rather than redeclaring them.
- Resolve callable fields at display time. Hotspot content, positions, and disabled states may be functions.
- Reproduce the coordinate contract exactly, including `translate(-50%, -50%)` and the letterbox offsets.
- Preserve button semantics and keyboard behaviour for interactive hotspots, and keep `mapImage` non-interactive: no `action`, tooltip, hover or active artwork, or pointer interception.
- Use stable hotspot ids as React keys when present, and fall back to the ordered index for anonymous display data.

## Verification checklist

- [ ] Hotspot centres compared **numerically** before and after the change, not by screenshot.
- [ ] Checked at a wide viewport, a square-ish viewport, and a mobile viewport -- the letterbox axis flips between them.
- [ ] Checked after a container resize, not only on first paint.
- [ ] Hover, active, and disabled artwork still switch on image hotspots.
- [ ] `mapImage` elements still ignore pointer events.
- [ ] Edge-rail elements still sit outside the image and did not inherit fit maths.
