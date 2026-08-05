### HOW TO PUBLISH

Publishing runs in CI (the `release` job in `.github/workflows/ci.yml`), right after
`build-test` goes green on `main`. Locally you only describe and bump.

#### 1. Describe the change

```shell
bun run changeset
```

Interactively select the affected packages (@react-text-game/core, @react-text-game/ui)
and the bump type:
• patch — bug fixes, minor changes.
• minor — backward-compatible features.
• major — breaking changes.
Write a short description (it will go into the CHANGELOG).

#### 2. Bump versions

```shell
bun run version-packages
```

This consumes the changeset files, rewrites versions and CHANGELOGs, and refreshes
`bun.lock` so CI's `--frozen-lockfile` install keeps working.

#### 3. Push to main

```shell
git add -A && git commit -m "Version Packages" && git push
```

CI then builds, lints, typechecks, tests, and — only if all of that passes — publishes
every package whose version is not yet on npm, pushes the `@react-text-game/<pkg>@<version>`
tags, and creates the matching GitHub Releases.

Nothing gets published when versions are unchanged, so ordinary pushes to `main` are safe.
A release can be re-run from **Actions → CI → Run workflow** if npm was unavailable.

#### Fallback: unversioned changesets on main

If a changeset file reaches `main` without step 2, CI opens a "Version Packages" PR with
the bumps instead of publishing. Merge it to release, or drop it and run step 2 locally.

#### One-time setup

- `NPM_TOKEN` repository secret — a granular npm access token with read/write on the
  `@react-text-game` scope. `GITHUB_TOKEN` is provided by Actions automatically.
- On npmjs.com the packages must allow automation tokens
  (Settings → "Require two-factor authentication or an automation token"; the
  "disallow tokens" variant blocks CI publishing).
- Provenance is enabled via `NPM_CONFIG_PROVENANCE`, which is why every publishable
  package carries an explicit `repository` object with its `directory`.
