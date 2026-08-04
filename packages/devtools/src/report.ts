import type { CheckResult, Finding, Severity } from "#types";

const plural = (count: number, word: string): string =>
    `${count} ${word}${count === 1 ? "" : "s"}`;

const countBy = (findings: Finding[], severity: Severity): number =>
    findings.filter((finding) => finding.severity === severity).length;

/**
 * Renders findings as an indented, severity-tagged list.
 *
 * @param findings - Findings to render, already ordered
 * @returns Printable text, or a single line when there is nothing to report
 */
export const formatFindings = (findings: Finding[]): string => {
    if (findings.length === 0) {
        return "No differences found.";
    }

    return findings
        .map((finding) => {
            const heading = finding.subject
                ? `[${finding.severity}] ${finding.subject} (${finding.code})`
                : `[${finding.severity}] ${finding.code}`;

            return `${heading}\n    ${finding.message}`;
        })
        .join("\n\n");
};

/**
 * Renders a full check report: what was compared, every finding, and the verdict.
 *
 * @param result - Result of comparing two schemas
 * @returns Printable text
 */
export const formatCheckResult = (result: CheckResult): string => {
    const header = `Comparing ${result.baselineVersion} (baseline) against ${result.currentVersion} (current).`;
    const errors = countBy(result.findings, "error");
    const warnings = countBy(result.findings, "warning");
    const notes = countBy(result.findings, "info");

    const counts = `${plural(errors, "error")}, ${plural(warnings, "warning")}, ${plural(notes, "note")}`;

    let verdict: string;

    if (!result.migrationRequired) {
        verdict = `No migration needed: ${plural(notes, "note")}.`;
    } else if (result.migrationSatisfied) {
        verdict = `Migration needed and one is registered for ${result.baselineVersion} to ${result.currentVersion} (${counts}). This tool checks only that a migration exists, not that it is correct - test it against a real save.`;
    } else {
        verdict = `Migration required: ${counts}.`;
    }

    return `${header}\n\n${formatFindings(result.findings)}\n\n${verdict}`;
};
