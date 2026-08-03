# Contributing to the monorepo

Applies only to work inside the `react-text-game` repository itself. For building a game with the published packages, none of this is relevant.

## Contents

- Toolchain
- Tests and coverage
- Verification
- Changing MDX transforms
- Performance work
- Documentation plumbing
- Reporting

## Toolchain

`CLAUDE.md` at the repository root is authoritative and is loaded automatically; follow it rather than re-deriving the rules here. In short: Bun 1.3.9 only, repository scripts only, Biome for lint and format, `bun.lock` as the single lockfile.

Dependency direction is `core <- ui` and `core <- mdx`. Nothing depends on `ui` or `mdx`. Keep it that way; a new cross-package dependency needs an explicit decision.

## Tests and coverage

- Tests live in `packages/<package>/src/tests`. Every behaviour change in `core`, `ui`, or `mdx` must add or update tests in that package.
- `bun run test:coverage` enforces at least 99% aggregate function and line coverage, at least 95% per runtime source file, and that every runtime file appears in LCOV.
- Never run tests from generated `dist` or `api-docs`, and never use `--if-present`.
- Example apps are not coverage targets.
- Design for testability: anything that reads wall-clock time, schedules timers, or touches `sessionStorage` needs an injection point, or the per-file threshold will be unreachable.

## Verification

Run from the repository root, per `CLAUDE.md`:

```bash
bun run lint
bun run typecheck
bun run test:coverage
bun run build
```

Then add checks proportional to the change:

- Build or pack each affected public package and confirm tests are absent from `dist`.
- Run the example app that exercises the changed path (`core-test-app`, `ui-test-app`, or `example-game`).
- For map work, follow the numeric checklist in [interactive-maps.md](interactive-maps.md).
- Add a changeset with `bun run changeset` for any change to `core`, `ui`, or `mdx`.

## Changing MDX transforms

- Keep AST transforms deterministic and preserve source order.
- Never execute game actions at compile time; emit runtime callbacks.
- Preserve the heading, text, media, conversation, action, include, and variable mappings when refactoring traversal.
- Add transform tests for static content, expressions, invalid properties, and mixed component order.
- Keep examples in docs and tests executable against the current public exports.

## Performance work

- Establish test, coverage, package-output, bundle, and hotspot-geometry baselines before refactoring.
- Prefer removing duplicate traversals, duplicate observers, unnecessary effects, and eager development logging over adding abstractions.
- Do not add memoization everywhere. Measure the expensive work first, and never rely on memoization for correctness -- side effects must not depend on evaluation count.
- Keep runtime dependencies targeted and `sideEffects` metadata honest so consumers can tree-shake.
- Compare generated `dist` contents and at least one consumer production bundle after package changes.
- Reject an optimization that changes serialized state, callable evaluation timing, navigation refresh, public types, accessibility, or map coordinates.

## Documentation plumbing

Adding a public entry point or package means touching more than the package:

- a TypeDoc config in `apps/docs` (one per entry point, e.g. `typedoc.core-audio.json`),
- the corresponding invocation in the root `docs:api` script,
- the source inputs for `@react-text-game/docs#build` in `turbo.json`,
- a guide page in `apps/docs/docs` and its sidebar position,
- README badges and the package list.

Build the documentation site and follow every new internal link and code example before calling the change complete.

## Reporting

State which invariant the change protects, which tests were run, what measurably changed in the output, and any remaining compatibility concern. Never claim map-coordinate safety from screenshots when the geometry can be compared numerically.
