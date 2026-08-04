import {
    type CheckResult,
    type Finding,
    type SaveSchema,
    type Severity,
    SYSTEM_KEY,
} from "#types";

const SEVERITY_RANK: Record<Severity, number> = {
    error: 0,
    warning: 1,
    info: 2,
};

/**
 * Kinds that describe an *empty* value rather than a shape.
 *
 * @remarks
 * A field that was `null` when the baseline was captured and holds a string now
 * has not necessarily changed type - it may simply have been unset at capture
 * time. `_system.game.currentPassageId` is exactly this: `null` before the game
 * navigates anywhere, a string in any real save. Treating these as changes would
 * bury the real findings in noise, so a difference involving one is not reported.
 */
const INDETERMINATE_KINDS = new Set(["null", "undefined", "array<unknown>"]);

const owner = (path: string): string => path.split(".")[0] ?? path;

const parentOf = (path: string): string => {
    const lastDot = path.lastIndexOf(".");

    return lastDot === -1 ? "" : path.slice(0, lastDot);
};

const difference = (left: string[], right: string[]): string[] => {
    const excluded = new Set(right);

    return left.filter((value) => !excluded.has(value));
};

/**
 * Pairs a removed path with an added path that shares its parent and kind.
 *
 * @remarks
 * A rename looks exactly like a removal plus an addition, but its consequence is
 * far worse: the player's value stays behind under the old name while the new
 * one silently falls back to its default. Reporting the pair lets a human make
 * the call instead of burying it in two `info` lines.
 */
const pairRenames = (
    removed: string[],
    added: string[],
    baseline: SaveSchema,
    current: SaveSchema
): {
    renames: Array<{ from: string; to: string }>;
    removedRest: string[];
    addedRest: string[];
} => {
    const renames: Array<{ from: string; to: string }> = [];
    const addedRest = [...added];
    const removedRest: string[] = [];

    for (const from of removed) {
        const to = addedRest.find(
            (candidate) =>
                parentOf(candidate) === parentOf(from) &&
                current.paths[candidate] === baseline.paths[from]
        );

        if (to === undefined) {
            removedRest.push(from);
            continue;
        }

        addedRest.splice(addedRest.indexOf(to), 1);
        renames.push({ from, to });
    }

    return { renames, removedRest, addedRest };
};

/**
 * Compares a baseline snapshot against the current save shape.
 *
 * Classification follows the engine's actual load behaviour
 * (`BaseGameObject.load()`), not intuition:
 *
 * - a **new field** on an existing entity keeps its default, because loading
 *   merges the save over the freshly constructed defaults - harmless
 * - a **new entity** the save knows nothing about has its variables *cleared*,
 *   not defaulted - it needs a migration
 * - a **renamed field** leaves the player's value stranded under the old name
 * - a **changed kind** hands the game a value of the wrong type
 * - a **removed passage** leaves `_system.game.currentPassageId` dangling, and
 *   the engine resolves it to `null` without complaining
 *
 * @param baseline - Schema of the released version
 * @param current - Schema of the version under development
 * @param migrationPathExists - Whether the game registers a migration chain from
 * the baseline version to the current one. Pass `null` when unknown, which is
 * the case for any capture that did not import the game's code.
 * @returns Findings plus whether a migration is required
 *
 * @example
 * ```typescript
 * const result = diffSchemas(baseline, current);
 * if (result.migrationRequired) {
 *     console.error(result.findings);
 * }
 * ```
 */
export const diffSchemas = (
    baseline: SaveSchema,
    current: SaveSchema,
    migrationPathExists: boolean | null = null
): CheckResult => {
    const findings: Finding[] = [];

    const entitiesAdded = difference(current.entities, baseline.entities);
    const entitiesRemoved = difference(baseline.entities, current.entities);
    const sharedOwners = new Set([
        ...current.entities.filter((entity) =>
            baseline.entities.includes(entity)
        ),
        SYSTEM_KEY,
    ]);

    for (const entity of entitiesAdded) {
        findings.push({
            code: "entity-added",
            severity: "error",
            subject: entity,
            message: `Entity "${entity}" is new. Loading an older save clears its variables instead of keeping their defaults, so it needs a migration that seeds it.`,
        });
    }

    for (const entity of entitiesRemoved) {
        findings.push({
            code: "entity-removed",
            severity: "info",
            subject: entity,
            message: `Entity "${entity}" no longer exists. Its data stays in old saves as dead weight, which is harmless.`,
        });
    }

    // Paths belonging to an added or removed entity are already covered by the
    // entity finding; listing every one of their fields would only add noise.
    const inScope = (path: string): boolean => sharedOwners.has(owner(path));
    const baselinePaths = Object.keys(baseline.paths).filter(inScope);
    const currentPaths = Object.keys(current.paths).filter(inScope);

    for (const path of baselinePaths) {
        const before = baseline.paths[path];
        const after = current.paths[path];

        if (
            after !== undefined &&
            before !== undefined &&
            before !== after &&
            !INDETERMINATE_KINDS.has(before) &&
            !INDETERMINATE_KINDS.has(after)
        ) {
            findings.push({
                code: "kind-changed",
                severity: "error",
                subject: path,
                message: `"${path}" changed from ${before} to ${after}. Old saves still hold the previous type, so it needs a migration that converts it.`,
            });
        }
    }

    const { renames, removedRest, addedRest } = pairRenames(
        difference(baselinePaths, currentPaths),
        difference(currentPaths, baselinePaths),
        baseline,
        current
    );

    for (const { from, to } of renames) {
        findings.push({
            code: "possible-rename",
            severity: "warning",
            subject: from,
            message: `"${from}" disappeared and "${to}" appeared with the same type. If this is a rename, old saves keep the value under "${from}" and "${to}" falls back to its default - migrate it. If the two are unrelated, no migration is needed.`,
        });
    }

    for (const path of addedRest) {
        findings.push({
            code: "field-added",
            severity: "info",
            subject: path,
            message: `"${path}" is new. Loading merges the save over the defaults, so old saves pick up its default value.`,
        });
    }

    for (const path of removedRest) {
        findings.push({
            code: "field-removed",
            severity: "info",
            subject: path,
            message: `"${path}" was removed. Old saves re-add it as an unused variable, which is harmless.`,
        });
    }

    if (baseline.passages !== null && current.passages !== null) {
        for (const passage of difference(baseline.passages, current.passages)) {
            findings.push({
                code: "passage-removed",
                severity: "error",
                subject: passage,
                message: `Passage "${passage}" no longer exists. A save left on it resolves to no passage at all, silently, so it needs a migration that redirects _system.game.currentPassageId.`,
            });
        }
    }

    const migrationRequired = findings.some(
        (finding) => finding.severity !== "info"
    );

    if (migrationRequired && baseline.gameVersion === current.gameVersion) {
        findings.push({
            code: "version-not-bumped",
            severity: "error",
            subject: "",
            message: `The save shape changed but gameVersion is still ${current.gameVersion}. Migrations only run when a save's version differs from the current one, so nothing would be migrated. Bump gameVersion.`,
        });
    }

    const versionBumped = baseline.gameVersion !== current.gameVersion;

    if (migrationRequired && versionBumped && migrationPathExists === false) {
        findings.push({
            code: "missing-migration",
            severity: "error",
            subject: "",
            message: `No registered migration chain leads from ${baseline.gameVersion} to ${current.gameVersion}. Register one with registerMigration() so old saves can be brought forward.`,
        });
    }

    if (migrationRequired && migrationPathExists === null) {
        findings.push({
            code: "missing-migration",
            severity: "info",
            subject: "",
            message:
                "Whether a migration is registered could not be checked, because this capture did not import the game's code. Re-run with --entry to verify the chain.",
        });
    }

    findings.sort(
        (left, right) =>
            SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity]
    );

    return {
        findings,
        migrationRequired,
        migrationSatisfied:
            migrationRequired && versionBumped && migrationPathExists === true,
        baselineVersion: baseline.gameVersion,
        currentVersion: current.gameVersion,
    };
};
