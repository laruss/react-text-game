# Contributing to the monorepo

Applies only to work inside the `react-text-game` repository itself. For building a game with the published packages, none of this is relevant.

## Contents

- Toolchain
- Tests and coverage
- Verification
- Changing MDX transforms
- Performance work
- Package output
- Documentation plumbing
- Reporting

## Toolchain

`CLAUDE.md` at the repository root is authoritative and is loaded automatically; follow it rather than re-deriving the rules here. In short: Bun 1.3.9 only, repository scripts only, Biome for lint and format, `bun.lock` as the single lockfile.

Dependency direction is `core <- ui`, `core <- mdx`, `core <- messenger` and `core <- devtools`. Nothing depends on `ui`, `mdx`, `messenger` or `devtools`. Keep it that way; a new cross-package dependency needs an explicit decision.

`devtools` declares `core` as a peer dependency and reaches it through a dynamic import, so it resolves to the same installed copy the user's game loaded. A second copy would carry its own empty migration registry and the migration-path check would silently pass.

## Tests and coverage

- Tests live in `packages/<package>/src/tests`. Every behaviour change in `core`, `ui`, `mdx`, `messenger`, or `devtools` must add or update tests in that package.
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
- Add a changeset with `bun run changeset` for any change to `core`, `ui`, `mdx`, `messenger`, or `devtools`.

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

## Package output

The build is `tsc` plus `tsc-alias`, with no bundler. Two consequences are easy to miss:

- `tsc` does not rewrite `#*` alias specifiers, and with `moduleResolution: "bundler"` it emits **extensionless** relative paths. Node's ESM resolver cannot resolve those, and cannot resolve a directory to its index either, so a package built without `"tsc-alias": { "resolveFullPaths": true }` in its `tsconfig.build.json` is importable by Bun and bundlers but **not** by Node. `core` and `devtools` set it; `ui`, `mdx` and `messenger` do not yet.
- A bare subpath into a dependency without an `exports` map gets no extension either. Spell such imports out in full -- `crypto-js/aes.js`, not `crypto-js/aes`.

Verify with the runtime, not by reading the output:

```bash
node -e 'import("@react-text-game/core").then(m => console.log(Object.keys(m).length))'
```

Anything shipping a `bin` must additionally run under both runtimes. Check the built binary with `node` and with `bun`, and compare exit codes as well as output.

## Documentation plumbing

Adding a public entry point or package means touching more than the package:

- a TypeDoc config in `apps/docs` (one per entry point, e.g. `typedoc.core-audio.json`),
- the corresponding invocation in the root `docs:api` script,
- the source inputs for `@react-text-game/docs#build` in `turbo.json`,
- a guide page in `apps/docs/docs`, plus its entry in the manual `sidebars.ts` (a `sidebar_position` alone does nothing, since no sidebar is autogenerated),
- the navbar and footer entries in `docusaurus.config.ts`, which `onBrokenLinks: "throw"` will fail the build over,
- README badges and the package list, and the package table in `apps/docs/docs/intro.md`,
- the package lists in `CLAUDE.md` and `AGENTS.md`, which must stay identical apart from their heading,
- this skill: `SKILL.md`'s description, its routing table and its entry-point list, plus the package lists in this file.

The skill is instructions another agent will act on, so stale guidance there is worse than stale prose in the docs. When a topic needs more than a few lines, give it a `references/*.md` page and route to it from the table -- `SKILL.md` holds the decision, the reference holds the depth. Correct any existing statement the change makes wrong, rather than only adding to it.

Build the documentation site and follow every new internal link and code example before calling the change complete.

## Reporting

State which invariant the change protects, which tests were run, what measurably changed in the output, and any remaining compatibility concern. Never claim map-coordinate safety from screenshots when the geometry can be compared numerically.
