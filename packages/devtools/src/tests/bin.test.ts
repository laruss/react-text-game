import { afterAll, describe, expect, test } from "bun:test";

import { captureConsole } from "./helpers";

const originalArgv = process.argv;

afterAll(() => {
    process.argv = originalArgv;
    // The binary reports through the process exit code; clear it so a successful
    // run of this suite is not mistaken for a failure.
    process.exitCode = 0;
});

describe("bin", () => {
    test("runs the CLI with process argv and reports its exit code", async () => {
        const output = captureConsole();
        process.argv = [originalArgv[0] ?? "bun", "rtg", "--help"];

        try {
            await import("#bin");
        } finally {
            output.restore();
        }

        expect(process.exitCode).toBe(0);
        expect(output.text).toContain("rtg - React Text Game developer tools");
    });
});
