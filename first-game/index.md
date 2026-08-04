---
title: Build your first game
description: Choose the core + UI tutorial for the supplied React renderers, or the core-only tutorial to build your own.
---

import Head from "@docusaurus/Head";
import { Redirect } from "@docusaurus/router";

{/* /first-game is an alias for the core + UI tutorial. The meta refresh covers
    the statically served HTML and crawlers; Redirect covers client-side navigation. */}

<Head>
    <meta httpEquiv="refresh" content="0; url=/first-game/core+ui" />
</Head>

<Redirect to="/first-game/core+ui" />

# Build your first game

There are two tutorials, one per setup:

-   [**With core + UI**](/first-game/core+ui) — `@react-text-game/core` runs the game
    and `@react-text-game/ui` renders it. Recommended, and where this page sends you.
-   [**With core only**](/first-game/core) — the engine alone, with a renderer you
    write yourself.
