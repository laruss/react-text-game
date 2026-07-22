import { isAbsolute, relative, resolve } from "node:path";
import ts from "typescript";

const packagePath = process.argv[2];

if (!packagePath) {
    throw new Error("Usage: bun scripts/check-coverage.ts <package-path>");
}

const repositoryRoot = resolve(import.meta.dir, "..");
const packageRoot = resolve(repositoryRoot, packagePath);
const coverageFile = Bun.file(resolve(packageRoot, "coverage/lcov.info"));
const minimumFileCoverage = 0.95;
const minimumPackageCoverage = 0.99;

if (!(await coverageFile.exists())) {
    throw new Error(`Coverage report not found for ${packagePath}`);
}

const coverageRecords = parseCoverage(await coverageFile.text());

const missingFiles: string[] = [];
const filesBelowThreshold: string[] = [];
const packageCoverage: CoverageRecord = {
    functionsFound: 0,
    functionsHit: 0,
    linesFound: 0,
    linesHit: 0,
};
const sourceFiles = new Bun.Glob("src/**/*.{ts,tsx,mts,cts}");

for await (const sourcePath of sourceFiles.scan({
    cwd: packageRoot,
    onlyFiles: true,
})) {
    if (sourcePath.startsWith("src/tests/") || sourcePath.endsWith(".d.ts")) {
        continue;
    }

    const absolutePath = resolve(packageRoot, sourcePath);
    const sourceText = await Bun.file(absolutePath).text();

    if (!hasRuntimeCode(absolutePath, sourceText)) {
        continue;
    }

    const repositoryPath = toPosix(relative(repositoryRoot, absolutePath));

    const coverage = coverageRecords.get(repositoryPath);

    if (!coverage) {
        missingFiles.push(repositoryPath);
        continue;
    }

    const lineCoverage = ratio(coverage.linesHit, coverage.linesFound);
    const ignoredImplicitConstructors = countStaticOnlyImplicitConstructors(
        absolutePath,
        sourceText
    );
    const functionsFound = Math.max(
        coverage.functionsHit,
        coverage.functionsFound - ignoredImplicitConstructors
    );
    const functionCoverage = ratio(coverage.functionsHit, functionsFound);

    packageCoverage.functionsFound += functionsFound;
    packageCoverage.functionsHit += coverage.functionsHit;
    packageCoverage.linesFound += coverage.linesFound;
    packageCoverage.linesHit += coverage.linesHit;

    if (
        lineCoverage < minimumFileCoverage ||
        functionCoverage < minimumFileCoverage
    ) {
        filesBelowThreshold.push(
            `${repositoryPath} (lines ${formatPercent(lineCoverage)}, functions ${formatPercent(functionCoverage)})`
        );
    }
}

if (missingFiles.length > 0) {
    throw new Error(
        `Coverage is missing runtime source files:\n${missingFiles
            .sort()
            .map((file) => `- ${file}`)
            .join("\n")}`
    );
}

if (filesBelowThreshold.length > 0) {
    throw new Error(
        `Per-file coverage is below ${formatPercent(minimumFileCoverage)}:\n${filesBelowThreshold
            .sort()
            .map((file) => `- ${file}`)
            .join("\n")}`
    );
}

const packageLineCoverage = ratio(
    packageCoverage.linesHit,
    packageCoverage.linesFound
);
const packageFunctionCoverage = ratio(
    packageCoverage.functionsHit,
    packageCoverage.functionsFound
);

if (
    packageLineCoverage < minimumPackageCoverage ||
    packageFunctionCoverage < minimumPackageCoverage
) {
    throw new Error(
        `Package coverage is below ${formatPercent(minimumPackageCoverage)} (lines ${formatPercent(packageLineCoverage)}, functions ${formatPercent(packageFunctionCoverage)})`
    );
}

console.log(
    `Coverage for ${packagePath}: lines ${formatPercent(packageLineCoverage)}, functions ${formatPercent(packageFunctionCoverage)}; every runtime file meets ${formatPercent(minimumFileCoverage)}.`
);

interface CoverageRecord {
    functionsFound: number;
    functionsHit: number;
    linesFound: number;
    linesHit: number;
}

function parseCoverage(lcov: string): Map<string, CoverageRecord> {
    const records = new Map<string, CoverageRecord>();

    for (const block of lcov.split("end_of_record")) {
        const values = new Map(
            block
                .trim()
                .split("\n")
                .map((line): [string, string] => {
                    const separatorIndex = line.indexOf(":");

                    return separatorIndex === -1
                        ? [line, ""]
                        : [
                              line.slice(0, separatorIndex),
                              line.slice(separatorIndex + 1),
                          ];
                })
        );
        const sourcePath = values.get("SF");

        if (!sourcePath) {
            continue;
        }

        records.set(normalizeCoveragePath(sourcePath), {
            functionsFound: Number(values.get("FNF") ?? 0),
            functionsHit: Number(values.get("FNH") ?? 0),
            linesFound: Number(values.get("LF") ?? 0),
            linesHit: Number(values.get("LH") ?? 0),
        });
    }

    return records;
}

function ratio(hit: number, found: number): number {
    return found === 0 ? 1 : hit / found;
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
}

function normalizeCoveragePath(sourcePath: string): string {
    const normalizedPath = toPosix(sourcePath.trim());

    if (isAbsolute(normalizedPath)) {
        return toPosix(relative(repositoryRoot, normalizedPath));
    }

    if (normalizedPath.startsWith("src/")) {
        return toPosix(
            relative(repositoryRoot, resolve(packageRoot, normalizedPath))
        );
    }

    return normalizedPath.replace(/^\.\//, "");
}

function hasRuntimeCode(filePath: string, sourceText: string): boolean {
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        false
    );

    return sourceFile.statements.some((statement) => {
        if (
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement)
        ) {
            return false;
        }

        if (ts.isImportDeclaration(statement)) {
            const clause = statement.importClause;

            if (!clause) {
                return true;
            }

            if (clause.isTypeOnly) {
                return false;
            }

            if (clause.name || ts.isNamespaceImport(clause.namedBindings)) {
                return true;
            }

            return clause.namedBindings?.elements.some(
                (element) => !element.isTypeOnly
            );
        }

        if (ts.isExportDeclaration(statement)) {
            if (statement.isTypeOnly) {
                return false;
            }

            if (
                statement.exportClause &&
                ts.isNamedExports(statement.exportClause)
            ) {
                return statement.exportClause.elements.some(
                    (element) => !element.isTypeOnly
                );
            }

            return true;
        }

        return !statement.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.DeclareKeyword
        );
    });
}

function countStaticOnlyImplicitConstructors(
    filePath: string,
    sourceText: string
): number {
    const sourceFile = ts.createSourceFile(
        filePath,
        sourceText,
        ts.ScriptTarget.Latest,
        false
    );

    // Bun 1.3 reports one function for an implicit constructor on static-only
    // classes, but never marks that synthetic function as hit, even if the
    // class is instantiated. Ignore only that known, non-instrumentable slot.
    return sourceFile.statements.filter(
        (statement) =>
            ts.isClassDeclaration(statement) &&
            statement.members.length > 0 &&
            !statement.members.some(ts.isConstructorDeclaration) &&
            statement.members.every((member) =>
                member.modifiers?.some(
                    (modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword
                )
            )
    ).length;
}

function toPosix(filePath: string): string {
    return filePath.replaceAll("\\", "/");
}
