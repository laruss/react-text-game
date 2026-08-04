import { describe, expect, test } from "bun:test";

import { formatCheckResult, formatFindings } from "#report";
import type { CheckResult, Finding } from "#types";

const finding = (overrides: Partial<Finding> = {}): Finding => ({
    code: "kind-changed",
    severity: "error",
    subject: "player.age",
    message: "changed from number to string",
    ...overrides,
});

const result = (overrides: Partial<CheckResult> = {}): CheckResult => ({
    findings: [],
    migrationRequired: false,
    migrationSatisfied: false,
    baselineVersion: "1.0.0",
    currentVersion: "2.0.0",
    ...overrides,
});

describe("formatFindings", () => {
    test("says so when there is nothing to report", () => {
        expect(formatFindings([])).toBe("No differences found.");
    });

    test("tags each finding with its severity, subject and code", () => {
        expect(formatFindings([finding()])).toBe(
            "[error] player.age (kind-changed)\n    changed from number to string"
        );
    });

    test("omits the subject for whole-schema findings", () => {
        expect(
            formatFindings([
                finding({ code: "version-not-bumped", subject: "" }),
            ])
        ).toBe("[error] version-not-bumped\n    changed from number to string");
    });

    test("separates findings with a blank line", () => {
        expect(
            formatFindings([finding(), finding({ subject: "player.name" })])
        ).toContain("\n\n");
    });
});

describe("formatCheckResult", () => {
    test("names both versions being compared", () => {
        expect(formatCheckResult(result())).toContain(
            "Comparing 1.0.0 (baseline) against 2.0.0 (current)."
        );
    });

    test("counts only notes when no migration is needed", () => {
        expect(
            formatCheckResult(
                result({ findings: [finding({ severity: "info" })] })
            )
        ).toContain("No migration needed: 1 note.");
    });

    test("pluralises counts", () => {
        expect(
            formatCheckResult(
                result({
                    findings: [
                        finding({ severity: "info" }),
                        finding({ severity: "info" }),
                    ],
                })
            )
        ).toContain("2 notes.");
    });

    test("demands a migration when none covers the change", () => {
        expect(
            formatCheckResult(
                result({
                    findings: [finding(), finding({ severity: "warning" })],
                    migrationRequired: true,
                })
            )
        ).toContain("Migration required: 1 error, 1 warning, 0 notes.");
    });

    test("acknowledges a registered migration without vouching for it", () => {
        const text = formatCheckResult(
            result({
                findings: [finding()],
                migrationRequired: true,
                migrationSatisfied: true,
            })
        );

        expect(text).toContain("one is registered for 1.0.0 to 2.0.0");
        expect(text).toContain("not that it is correct");
    });
});
