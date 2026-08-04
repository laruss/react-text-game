import { describe, expect, test } from "bun:test";

import * as devtools from "#index";

describe("public package entry point", () => {
    test("exports the schema, diff, report and store helpers", () => {
        expect(devtools.describeKind).toBeFunction();
        expect(devtools.buildSchema).toBeFunction();
        expect(devtools.mergeSchemas).toBeFunction();
        expect(devtools.diffSchemas).toBeFunction();
        expect(devtools.formatFindings).toBeFunction();
        expect(devtools.formatCheckResult).toBeFunction();
        expect(devtools.readSchema).toBeFunction();
        expect(devtools.writeSchema).toBeFunction();
        expect(devtools.findLatestSchema).toBeFunction();
        expect(devtools.snapshotPath).toBeFunction();
        expect(devtools.compareVersions).toBeFunction();
        expect(devtools.schemaFromSaveFile).toBeFunction();
        expect(devtools.schemaFromDump).toBeFunction();
        expect(devtools.loadGameSchema).toBeFunction();
    });

    test("exports the constants callers need", () => {
        expect(devtools.SCHEMA_VERSION).toBe(1);
        expect(devtools.DEFAULT_SCHEMA_DIR).toBe("save-schemas");
        expect(devtools.SYSTEM_KEY).toBe("_system");
        expect(devtools.SYSTEM_SAVE_NAME).toBe("__SYSTEM_INITIAL_STATE__");
    });

    test("does not leak the CLI's process-level concerns", () => {
        expect(devtools).not.toHaveProperty("run");
        expect(devtools).not.toHaveProperty("EXIT");
        expect(devtools).not.toHaveProperty("runCheck");
        expect(devtools).not.toHaveProperty("runSnapshot");
    });
});
