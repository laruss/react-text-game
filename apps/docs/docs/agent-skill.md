---
title: Agent skill
description: Install the React Text Game skill so Codex and other coding agents can follow the library's runtime, UI, MDX, and map-coordinate contracts.
---

# Agent skill

The `react-text-game` agent skill gives compatible coding agents focused guidance for building, reviewing, and refactoring React Text Game projects. It covers the contracts that are easiest to break accidentally:

- engine initialization, entity registration, passages, saves, and migrations;
- preloading, loading screens, and splash-screen order;
- responsive map coordinates, hotspots, and decorative `mapImage` entities;
- replaceable UI component slots and accessible custom components;
- MDX transforms and runtime story behavior;
- the repository's Bun-based test, coverage, build, and package checks.

The skill is useful both in games that consume the libraries and when contributing to the React Text Game monorepo. It provides instructions to an agent; it does not add runtime code or dependencies to your game bundle.

## Install it

Install the skill in the current project:

```bash
npx skills add laruss/react-text-game --skill react-text-game
```

The CLI detects supported agents and lets you choose where to install it. To target Codex explicitly:

```bash
npx skills add laruss/react-text-game --skill react-text-game --agent codex
```

For a user-level installation that is available across projects, add `--global`:

```bash
npx skills add laruss/react-text-game --skill react-text-game --agent codex --global
```

Use `--yes` when you need a non-interactive installation, such as in a development-container setup:

```bash
npx skills add laruss/react-text-game --skill react-text-game --agent codex --global --yes
```

These commands invoke the standalone skills CLI. They do not change React Text Game's use of Bun or create an npm lockfile in your game repository.

## Verify and update it

List installed skills and confirm that `react-text-game` is present:

```bash
npx skills list
```

Update the installed copy after a new version is pushed to GitHub:

```bash
npx skills update react-text-game
```

Remove it when it is no longer needed:

```bash
npx skills remove react-text-game
```

## What the agent should help with

After installation, ask the agent naturally. For example:

```text
Add a mapImage to the world map without changing any hotspot coordinates.
```

```text
Create a custom loading screen and keep the default preload lifecycle.
```

```text
Review this save migration and run the required React Text Game checks.
```

The agent loads the skill when the request matches its description; no slash command is required. You can also mention `react-text-game` explicitly when you want to make the intended context unambiguous.

## Source and skills.sh

The source is [`skills/react-text-game/SKILL.md`](https://github.com/laruss/react-text-game/blob/main/skills/react-text-game/SKILL.md). Review it before installation if you want to inspect every instruction given to the agent.

skills.sh discovers public skills from installations made through its CLI. There is no separate submission form. Once indexed, the skill page is available at:

```text
https://skills.sh/laruss/react-text-game/react-text-game
```

See the official [skills CLI reference](https://skills.sh/docs/cli) for supported agents and installation flags, and the [skills.sh FAQ](https://skills.sh/docs/faq) for listing and telemetry details.
