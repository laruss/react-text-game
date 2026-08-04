#!/usr/bin/env node
import { readFile } from "node:fs/promises";

import { run } from "#cli";

// Resolves to this package's own manifest from both `src` and `dist`.
const manifest = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8")
) as { version: string };

// Setting the code rather than calling process.exit lets buffered stdout flush.
process.exitCode = await run(process.argv.slice(2), manifest.version);
