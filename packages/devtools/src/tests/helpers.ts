import { spyOn } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
    type SaveSchema,
    SCHEMA_VERSION,
    type SchemaKind,
    SYSTEM_KEY,
} from "#types";

/**
 * Creates an empty directory under the OS temp dir.
 *
 * @remarks
 * The commands read and write real files, so the tests give them real ones.
 */
export const makeTempDir = (): Promise<string> =>
    mkdtemp(join(tmpdir(), "rtg-devtools-"));

export const removeTempDir = (directory: string): Promise<void> =>
    rm(directory, { recursive: true, force: true });

/**
 * Redirects console output so tests can assert on it.
 */
export const captureConsole = () => {
    const out: string[] = [];
    const err: string[] = [];

    const log = spyOn(console, "log").mockImplementation(
        (...args: unknown[]) => {
            out.push(args.join(" "));
        }
    );
    const error = spyOn(console, "error").mockImplementation(
        (...args: unknown[]) => {
            err.push(args.join(" "));
        }
    );

    return {
        out,
        err,
        get text(): string {
            return [...out, ...err].join("\n");
        },
        restore(): void {
            log.mockRestore();
            error.mockRestore();
        },
    };
};

/**
 * Builds a schema from a path map, deriving the entity list from it.
 */
export const schemaOf = (
    paths: Record<string, SchemaKind>,
    overrides: Partial<SaveSchema> = {}
): SaveSchema => ({
    schemaVersion: SCHEMA_VERSION,
    gameVersion: "1.0.0",
    capturedFrom: "code",
    entities: Array.from(
        new Set(
            Object.keys(paths)
                .map((path) => path.split(".")[0] ?? path)
                .filter((key) => key !== SYSTEM_KEY)
        )
    ).sort(),
    passages: [],
    paths,
    ...overrides,
});
