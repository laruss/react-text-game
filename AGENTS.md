# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

## Repository Toolchain (Mandatory)

This repository is developed with **Bun 1.3.9**. Run repository commands from the
repository root unless a command below explicitly says otherwise.

- Use `bun install`, `bun run <script>`, `bunx --bun <binary>`, and `bun pm`.
- Do not use `npm`, `npx`, `pnpm`, or `yarn` for repository work, and do not
  add another package-manager lockfile. `bun.lock` is the only lockfile.
- Use Biome through the repository scripts. Do not invoke ESLint or Prettier.

### Tests

The root scripts are the source of truth:

- `bun run test` runs the complete source test suite through Turborepo.
- `bun run test --filter=@react-text-game/core` runs one workspace; replace the
  filter with `@react-text-game/mdx` or `@react-text-game/ui` as needed.
- `bun run test:coverage` is mandatory final verification for changes to a
  publishable package. It enforces at least 99% aggregate function and line
  coverage, at least 95% per runtime source file, and verifies that every such
  file appears in LCOV.
- During a tight edit loop only, `bun test packages/<package>/src/tests/<file>`
  may run one test file. It never replaces the final root commands.
- Never use `--if-present`, never run tests from generated `dist` or `api-docs`,
  and treat a missing test script in `packages/core`, `packages/mdx`, or
  `packages/ui` as a configuration error. Example apps are not coverage targets.
- Every behavior change in `packages/core`, `packages/mdx`, or `packages/ui`
  must add or update tests in that package before the task is complete.

### Required Verification

Run the checks relevant to the change, and for package code run all of them:

```bash
bun run lint
bun run typecheck
bun run test:coverage
bun run build
```

Use `bun run format` to apply Biome formatting.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
