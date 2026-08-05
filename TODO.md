### TODO

- [ ] create assets loader: `preloadContent` and the `GameProvider` `preload` prop
      already ship, what is missing is a named asset registry and per-passage
      loading instead of one list handed over at boot;
- [ ] now when conversation is on click, the actions are visible right away, need
      to fix it; `StoryContent` renders every component at once and the byClick
      reveal state never leaves `Conversation`, so there is nothing to gate on;
- [ ] enchase default menu component to get props for customization; `MainMenu`
      takes no props and the registry slot is `MainMenu?: () => ReactNode`, so
      only a full replacement is possible today;
- [ ] add emblem of react-text game in the left bottom corner of MainMenu; note
      that `AppIconMenu` already sits at `bottom-3 left-2` in dev mode;
- [ ] fix top, left, bottom, right buttons in ui package; the four side hotspot
      containers in `InteractiveMapComponent` have no flex layout, so hotspots
      stack in normal flow;
- [ ] add music controls; `AudioManager` already exposes master volume, mute and
      pause, only the ui component is missing;
- [ ] add `switchBgMusic` from example-game to core package; its module-level
      mutable state has to move onto `AudioManager`, and the manual fade needs to
      be deterministic under test;
- [x] set up script for automatic version update;
- [ ] redo tooltip implementation in interactiveMap component in core; the ui
      `Tooltip` does not clamp to the viewport, is mouse-only, and
      `getArrowRotation` returns the same value in every branch;
- [ ] add theme trigger to ui package; blocked by the theme fix in the roadmap;
- [x] add utility to determine whether a developer needs to create a save migration or not.
- [x] add i18n support;
- [x] add to git ignore `apps/docs/api` folder and build it on CI;
- [x] add the possibility to add basic styling to text components;
- [x] fix icon in google search;
- [ ] add proper errors handling from mdx package (e.g. passage is not registered
      in system, but being linked); `<Include>` compiles to an `anotherStory`
      component with no id validation, and `StoryComponent` casts the possibly
      null result of `getPassageById` to `Story`, so the failure surfaces as a
      crash inside the render;
- [x] rewrite the i18n plan into `docs/i18n-design.md`, describing what shipped;
- [ ] close the i18n gaps listed at the end of `docs/i18n-design.md`; the big
      one is that mdx passages cannot be translated at all, the next is that ui
      and messenger ship English defaults only;
- [x] fix ui package: conversation on click doesn't work; init passage isn't shown (and add tests for it);

### ROADMAP

- [x] fix bugs in ui package;
- [x] big docs update and enhancements;
- [ ] enchase ui package;
    - [ ] fix theme: display light bg on light theme (do not show dark bg, as in
          saves now); the dark `@theme` block in `packages/ui/src/styles/index.css`
          is nested inside `@media (prefers-color-scheme: dark)`, which Tailwind v4
          does not support - theme variables have to be declared top level;
    - [ ] add theme trigger to ui package; needs the theme fix above first, a
          runtime toggle cannot sit on top of `prefers-color-scheme`;
    - [ ] fix save slots, introduce slot sizes and number of slots; `SaveLoadModal`
          hardcodes `useSaveSlots({ count: 9 })`;
    - [ ] enchase the main menu: to add customization chances and possible to change or add buttons;
- [x] i18n support;
- [ ] create own components registry; needs a clearer definition - ui already has
      `ComponentsProvider` for overriding components inside an app;
- [x] new utils package (dev mode);
- [ ] ai integration;
- [ ] support other save formats;
- [x] messenger package, headless (`packages/messenger`);
- [ ] messenger package UI (see `packages/messenger/TODO.md`);
- [ ] passage graph viewer, twine style: every registered passage is a node, every
      jump between passages is an edge;
    - [ ] `rtg map` walks the source with the TypeScript compiler API and
          attributes each `Game.jumpTo("literal")` to the passage factory call that
          encloses it, then writes a generated graph artifact next to the save
          schemas; all 127 jumps in example-game are string literals, so resolving
          only literals is enough and the full import/instance resolution can wait;
    - [ ] render it in a `DevModeDrawer` modal in ui instead of a page served by the
          CLI - the game already holds the registry, which drops the whole `--entry`
          problem; lazy load it so it stays out of players' bundles;
    - [ ] keep coordinates in a second, author-owned artifact that regeneration
          merges rather than overwrites; seed a new node near its first parent and
          cluster by source folder, and never move a node that already has
          coordinates - a graph that reshuffles on every run is unusable;
    - [ ] `rtg map --watch` doubles as the sink that persists layout changes, one
          `node:http` route, so nothing depends on the bundler; a vite plugin could
          replace the port later but must not be the foundation;
    - [ ] overlay live state on the static graph: current passage, and which edges
          are actually reachable with the state the game holds right now;
    - [ ] explicitly out of scope: editing passages from the viewer, which means
          writing TypeScript back into the author's files and is a different product;
