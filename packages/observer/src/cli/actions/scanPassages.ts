import { readFile, writeFile } from "node:fs/promises";

import { parse } from "@typescript-eslint/typescript-estree";
import { glob } from "glob";

import { checkIsInitialized } from "#cli/actions/utils";
import { validatePassages } from "#helpers/validatePassages";
import { getGameObserverPaths } from "#paths";
import type {
    PassageConnection,
    PassageExtendedMetadata,
    PassagesMetadata,
    UtilsConfig,
} from "#types";

/**
 * Core passage data extracted from source code
 */
export interface PassageSourceData {
    id: string;
    type: "story" | "interactiveMap" | "widget";
    title?: string;
    filePath: string;
    lineNumber: number;
    source: "code"; // All scanned passages are marked as 'code' (user-created)
}

/**
 * Connection data extracted from source code with file context
 */
interface ConnectionSourceData {
    to: string; // Target passage ID
    filePath: string;
    lineNumber: number;
}

/**
 * Result of scanning passages
 */
export interface ScanPassagesResult {
    success: boolean;
    message: string;
    found: number;
    added: number;
    updated: number;
    removed: number;
    errors: string[];
}

/**
 * Options for scanning passages
 */
export interface ScanPassagesOptions {
    /** Root directory where to scan (defaults to process.cwd()) */
    rootDir?: string;
}

/**
 * Load config from config.json
 */
async function loadConfig(rootDir: string): Promise<UtilsConfig> {
    const paths = getGameObserverPaths(rootDir);

    try {
        const configContent = await readFile(paths.config, "utf-8");
        return JSON.parse(configContent) as UtilsConfig;
    } catch {
        // Return default config if file doesn't exist or is invalid
        return {
            passageDirectories: ["src"],
            excludePatterns: [
                "**/*.test.ts",
                "**/*.spec.ts",
                "**/node_modules/**",
            ],
        };
    }
}

/**
 * Load passages metadata from passages.json
 */
async function loadPassagesMetadata(
    rootDir: string
): Promise<PassagesMetadata> {
    const paths = getGameObserverPaths(rootDir);

    try {
        const content = await readFile(paths.passages, "utf-8");
        const data: unknown = JSON.parse(content);

        // Validate the data
        validatePassages(data);

        return data as PassagesMetadata;
    } catch (error) {
        throw new Error(
            `Failed to load passages metadata: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Save passages metadata to passages.json
 */
async function savePassagesMetadata(
    rootDir: string,
    metadata: PassagesMetadata
): Promise<void> {
    const paths = getGameObserverPaths(rootDir);

    // Validate before saving
    validatePassages(metadata);

    await writeFile(
        paths.passages,
        JSON.stringify(metadata, null, 2) + "\n",
        "utf-8"
    );
}

/**
 * Find all TypeScript files to scan
 */
async function findTypeScriptFiles(
    rootDir: string,
    config: UtilsConfig
): Promise<string[]> {
    const directories = config.passageDirectories || ["src"];
    const excludePatterns = config.excludePatterns || [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/node_modules/**",
    ];

    const patterns = directories.map((dir) => `${rootDir}/${dir}/**/*.ts`);

    const files = await glob(patterns, {
        ignore: excludePatterns.map((pattern) =>
            pattern.startsWith("**/") ? pattern : `**/${pattern}`
        ),
        absolute: true,
    });

    return files;
}

/**
 * Parse a TypeScript file and extract passage data
 */
async function parseFileForPassages(
    filePath: string
): Promise<PassageSourceData[]> {
    try {
        const content = await readFile(filePath, "utf-8");

        // Parse the TypeScript file
        const ast = parse(content, {
            loc: true,
            range: true,
            comment: false,
            jsx: true,
        });

        const passages: PassageSourceData[] = [];

        // Helper function to extract string literal value
        const getStringValue = (node: unknown): string | undefined => {
            if (
                node &&
                typeof node === "object" &&
                "type" in node &&
                node.type === "Literal" &&
                "value" in node &&
                typeof node.value === "string"
            ) {
                return node.value;
            }
            if (
                node &&
                typeof node === "object" &&
                "type" in node &&
                node.type === "TemplateLiteral" &&
                "quasis" in node &&
                Array.isArray(node.quasis) &&
                node.quasis.length === 1
            ) {
                const quasi = node.quasis[0];
                if (quasi && typeof quasi === "object" && "value" in quasi) {
                    const value = quasi.value as { cooked?: string };
                    return value.cooked;
                }
            }
            return undefined;
        };

        // Helper function to check if a call is a passage factory
        const getPassageType = (
            calleeName: string
        ): "story" | "interactiveMap" | "widget" | null => {
            if (calleeName === "newStory") return "story";
            if (calleeName === "newInteractiveMap") return "interactiveMap";
            if (calleeName === "newWidget") return "widget";
            return null;
        };

        // Traverse the AST to find factory calls
        const traverse = (node: unknown): void => {
            if (!node || typeof node !== "object") return;

            // Check if this is a call expression
            if (
                "type" in node &&
                node.type === "CallExpression" &&
                "callee" in node &&
                "arguments" in node
            ) {
                let calleeName: string | undefined;

                const callee = node.callee;
                // Direct call: newStory()
                if (
                    callee &&
                    typeof callee === "object" &&
                    "type" in callee &&
                    callee.type === "Identifier" &&
                    "name" in callee &&
                    typeof callee.name === "string"
                ) {
                    calleeName = callee.name;
                }

                if (calleeName) {
                    const passageType = getPassageType(calleeName);

                    const args = node.arguments;
                    if (passageType && Array.isArray(args) && args.length > 0) {
                        // First argument should be the passage ID
                        const idArg = args[0];
                        const id = getStringValue(idArg);

                        if (id) {
                            let lineNumber = 0;
                            if (
                                "loc" in node &&
                                node.loc &&
                                typeof node.loc === "object" &&
                                "start" in node.loc
                            ) {
                                const start = node.loc.start as {
                                    line?: number;
                                };
                                lineNumber = start.line || 0;
                            }

                            passages.push({
                                id,
                                type: passageType,
                                filePath,
                                lineNumber,
                                source: "code", // Mark as user-created
                            });
                        }
                    }
                }
            }

            // Recursively traverse child nodes
            for (const key in node) {
                if (key === "parent") continue; // Avoid circular references

                const child = (node as Record<string, unknown>)[key];
                if (Array.isArray(child)) {
                    child.forEach((item) => traverse(item));
                } else if (child && typeof child === "object") {
                    traverse(child);
                }
            }
        };

        traverse(ast);

        return passages;
    } catch (error) {
        // Return empty array and let the caller log the warning
        throw new Error(
            `Failed to parse file: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Parse a TypeScript file and extract Game.jumpTo() connections
 */
async function parseFileForConnections(
    filePath: string
): Promise<ConnectionSourceData[]> {
    try {
        const content = await readFile(filePath, "utf-8");

        // Parse the TypeScript file
        const ast = parse(content, {
            loc: true,
            range: true,
            comment: false,
            jsx: true,
        });

        const connections: ConnectionSourceData[] = [];

        // Helper function to extract string literal value
        const getStringValue = (node: unknown): string | undefined => {
            if (
                node &&
                typeof node === "object" &&
                "type" in node &&
                node.type === "Literal" &&
                "value" in node &&
                typeof node.value === "string"
            ) {
                return node.value;
            }
            if (
                node &&
                typeof node === "object" &&
                "type" in node &&
                node.type === "TemplateLiteral" &&
                "quasis" in node &&
                Array.isArray(node.quasis) &&
                node.quasis.length === 1
            ) {
                const quasi = node.quasis[0];
                if (quasi && typeof quasi === "object" && "value" in quasi) {
                    const value = quasi.value as { cooked?: string };
                    return value.cooked;
                }
            }
            return undefined;
        };

        // Traverse the AST to find Game.jumpTo() calls
        const traverse = (node: unknown): void => {
            if (!node || typeof node !== "object") return;

            // Check if this is a call expression
            if (
                "type" in node &&
                node.type === "CallExpression" &&
                "callee" in node &&
                "arguments" in node
            ) {
                const callee = node.callee;

                // Check for Game.jumpTo() pattern (MemberExpression)
                if (
                    callee &&
                    typeof callee === "object" &&
                    "type" in callee &&
                    callee.type === "MemberExpression" &&
                    "object" in callee &&
                    "property" in callee
                ) {
                    const obj = callee.object;
                    const prop = callee.property;

                    // Check if it's Game.jumpTo
                    if (
                        obj &&
                        typeof obj === "object" &&
                        "type" in obj &&
                        obj.type === "Identifier" &&
                        "name" in obj &&
                        obj.name === "Game" &&
                        prop &&
                        typeof prop === "object" &&
                        "type" in prop &&
                        prop.type === "Identifier" &&
                        "name" in prop &&
                        prop.name === "jumpTo"
                    ) {
                        const args = node.arguments;
                        if (Array.isArray(args) && args.length > 0) {
                            // First argument should be the target passage ID
                            const targetArg = args[0];
                            const targetId = getStringValue(targetArg);

                            if (targetId) {
                                let lineNumber = 0;
                                if (
                                    "loc" in node &&
                                    node.loc &&
                                    typeof node.loc === "object" &&
                                    "start" in node.loc
                                ) {
                                    const start = node.loc.start as {
                                        line?: number;
                                    };
                                    lineNumber = start.line || 0;
                                }

                                connections.push({
                                    to: targetId,
                                    filePath,
                                    lineNumber,
                                });
                            }
                        }
                    }
                }
            }

            // Recursively traverse child nodes
            for (const key in node) {
                if (key === "parent") continue; // Avoid circular references

                const child = (node as Record<string, unknown>)[key];
                if (Array.isArray(child)) {
                    child.forEach((item) => traverse(item));
                } else if (child && typeof child === "object") {
                    traverse(child);
                }
            }
        };

        traverse(ast);

        return connections;
    } catch (error) {
        // Return empty array and let the caller log the warning
        throw new Error(
            `Failed to parse file: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}

/**
 * Find the start passage configuration in TypeScript files
 * Looks for Game.init() calls and GameProvider options
 */
async function findStartPassage(
    rootDir: string,
    files: string[]
): Promise<string | null> {
    const DEFAULT_START_PASSAGE = "start-passage"; // From SYSTEM_PASSAGE_NAMES.START

    // Helper function to extract string literal value
    const getStringValue = (node: unknown): string | undefined => {
        if (
            node &&
            typeof node === "object" &&
            "type" in node &&
            node.type === "Literal" &&
            "value" in node &&
            typeof node.value === "string"
        ) {
            return node.value;
        }
        if (
            node &&
            typeof node === "object" &&
            "type" in node &&
            node.type === "TemplateLiteral" &&
            "quasis" in node &&
            Array.isArray(node.quasis) &&
            node.quasis.length === 1
        ) {
            const quasi = node.quasis[0];
            if (quasi && typeof quasi === "object" && "value" in quasi) {
                const value = quasi.value as { cooked?: string };
                return value.cooked;
            }
        }
        return undefined;
    };

    // Helper to extract startPassage from object literal properties
    const getStartPassageFromObject = (node: unknown): string | undefined => {
        if (!node || typeof node !== "object" || !("type" in node)) return undefined;

        if (node.type === "ObjectExpression" && "properties" in node) {
            const properties = node.properties;
            if (!Array.isArray(properties)) return undefined;

            for (const prop of properties) {
                if (
                    prop &&
                    typeof prop === "object" &&
                    "type" in prop &&
                    (prop.type === "Property" || prop.type === "ObjectProperty") &&
                    "key" in prop &&
                    "value" in prop
                ) {
                    const key = prop.key;
                    if (
                        key &&
                        typeof key === "object" &&
                        "type" in key &&
                        key.type === "Identifier" &&
                        "name" in key &&
                        key.name === "startPassage"
                    ) {
                        return getStringValue(prop.value);
                    }
                }
            }
        }

        return undefined;
    };

    for (const file of files) {
        try {
            const content = await readFile(file, "utf-8");

            // Parse the file
            const ast = parse(content, {
                loc: true,
                range: true,
                comment: false,
                jsx: true,
            });

            let foundStartPassage: string | undefined;

            // Traverse the AST
            const traverse = (node: unknown): void => {
                if (!node || typeof node !== "object") return;

                // Check for Game.init() calls
                if (
                    "type" in node &&
                    node.type === "CallExpression" &&
                    "callee" in node &&
                    "arguments" in node
                ) {
                    const callee = node.callee;

                    // Check for Game.init pattern
                    if (
                        callee &&
                        typeof callee === "object" &&
                        "type" in callee &&
                        callee.type === "MemberExpression" &&
                        "object" in callee &&
                        "property" in callee
                    ) {
                        const obj = callee.object;
                        const prop = callee.property;

                        if (
                            obj &&
                            typeof obj === "object" &&
                            "type" in obj &&
                            obj.type === "Identifier" &&
                            "name" in obj &&
                            obj.name === "Game" &&
                            prop &&
                            typeof prop === "object" &&
                            "type" in prop &&
                            prop.type === "Identifier" &&
                            "name" in prop &&
                            prop.name === "init"
                        ) {
                            const args = node.arguments;
                            if (Array.isArray(args) && args.length > 0) {
                                const optionsArg = args[0];
                                const startPassage = getStartPassageFromObject(optionsArg);
                                if (startPassage) {
                                    foundStartPassage = startPassage;
                                    return; // Found it, no need to continue
                                }
                            }
                        }
                    }
                }

                // Check for GameProvider JSX
                if (
                    "type" in node &&
                    (node.type === "JSXElement" || node.type === "JSXOpeningElement") &&
                    "openingElement" in node
                ) {
                    const opening = node.openingElement;
                    if (
                        opening &&
                        typeof opening === "object" &&
                        "name" in opening &&
                        "attributes" in opening
                    ) {
                        const name = opening.name;
                        if (
                            name &&
                            typeof name === "object" &&
                            "type" in name &&
                            name.type === "JSXIdentifier" &&
                            "name" in name &&
                            name.name === "GameProvider"
                        ) {
                            const attributes = opening.attributes;
                            if (Array.isArray(attributes)) {
                                for (const attr of attributes) {
                                    if (
                                        attr &&
                                        typeof attr === "object" &&
                                        "type" in attr &&
                                        attr.type === "JSXAttribute" &&
                                        "name" in attr &&
                                        "value" in attr
                                    ) {
                                        const attrName = attr.name;
                                        if (
                                            attrName &&
                                            typeof attrName === "object" &&
                                            "name" in attrName &&
                                            attrName.name === "options"
                                        ) {
                                            const attrValue = attr.value;
                                            if (
                                                attrValue &&
                                                typeof attrValue === "object" &&
                                                "type" in attrValue &&
                                                attrValue.type === "JSXExpressionContainer" &&
                                                "expression" in attrValue
                                            ) {
                                                const expr = attrValue.expression;
                                                const startPassage = getStartPassageFromObject(expr);
                                                if (startPassage) {
                                                    foundStartPassage = startPassage;
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Check standalone JSXOpeningElement (when node is already the opening element)
                if (
                    "type" in node &&
                    node.type === "JSXOpeningElement" &&
                    "name" in node &&
                    "attributes" in node
                ) {
                    const name = node.name;
                    if (
                        name &&
                        typeof name === "object" &&
                        "type" in name &&
                        name.type === "JSXIdentifier" &&
                        "name" in name &&
                        name.name === "GameProvider"
                    ) {
                        const attributes = node.attributes;
                        if (Array.isArray(attributes)) {
                            for (const attr of attributes) {
                                if (
                                    attr &&
                                    typeof attr === "object" &&
                                    "type" in attr &&
                                    attr.type === "JSXAttribute" &&
                                    "name" in attr &&
                                    "value" in attr
                                ) {
                                    const attrName = attr.name;
                                    if (
                                        attrName &&
                                        typeof attrName === "object" &&
                                        "name" in attrName &&
                                        attrName.name === "options"
                                    ) {
                                        const attrValue = attr.value;
                                        if (
                                            attrValue &&
                                            typeof attrValue === "object" &&
                                            "type" in attrValue &&
                                            attrValue.type === "JSXExpressionContainer" &&
                                            "expression" in attrValue
                                        ) {
                                            const expr = attrValue.expression;
                                            const startPassage = getStartPassageFromObject(expr);
                                            if (startPassage) {
                                                foundStartPassage = startPassage;
                                                return;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Recursively traverse child nodes
                for (const key in node) {
                    if (key === "parent") continue; // Avoid circular references

                    const child = (node as Record<string, unknown>)[key];
                    if (Array.isArray(child)) {
                        child.forEach((item) => traverse(item));
                    } else if (child && typeof child === "object") {
                        traverse(child);
                    }
                }
            };

            traverse(ast);

            if (foundStartPassage) {
                return foundStartPassage;
            }
        } catch (error) {
            // Silently skip files that can't be parsed
            continue;
        }
    }

    // Return default if not found
    return DEFAULT_START_PASSAGE;
}

/**
 * Find the next position for a new passage based on the last used position
 * Pattern: (0,0) -> (0,50) -> (50,50) -> (50,0) -> (100,0) -> (100,50) -> ...
 */
function getNextPosition(lastPosition: { x: number; y: number } | null): {
    x: number;
    y: number;
} {
    const STEP = 50;

    // Start from (0,0) if no previous position
    if (!lastPosition) {
        return { x: 0, y: 0 };
    }

    const { x, y } = lastPosition;

    // Pattern logic: alternate between y=0 and y=50 for each x coordinate
    if (y === 0) {
        // Move from (x, 0) to (x, 50)
        return { x, y: STEP };
    } else {
        // Move from (x, 50) to (x+50, 50)
        const newX = x + STEP;
        return { x: newX, y: STEP };
    }
}

/**
 * Find the last used position from existing passages
 */
function findLastPosition(
    passages: Record<string, PassageExtendedMetadata>
): { x: number; y: number } | null {
    let maxX = -1;
    let maxY = -1;

    for (const passage of Object.values(passages)) {
        if (passage.position) {
            if (
                passage.position.x > maxX ||
                (passage.position.x === maxX && passage.position.y > maxY)
            ) {
                maxX = passage.position.x;
                maxY = passage.position.y;
            }
        }
    }

    return maxX >= 0 ? { x: maxX, y: maxY } : null;
}

/**
 * Scans the project for passages and updates passages.json
 *
 * This function:
 * - Scans TypeScript files for passage factory calls (newStory, newInteractiveMap, newWidget)
 * - Extracts passage metadata (id, type)
 * - Updates passages.json with new/updated passages
 * - Removes passages that no longer exist in source
 * - Preserves extended metadata (tags, description, customMetadata)
 * - Assigns positions to new passages
 *
 * @param options - Scan options
 * @returns Result of the scan operation
 */
export async function scanPassages(
    options: ScanPassagesOptions = {}
): Promise<ScanPassagesResult> {
    const { rootDir = process.cwd() } = options;

    const errors: string[] = [];
    let found = 0;
    let added = 0;
    let updated = 0;
    let removed = 0;

    try {
        // Check if Game Observer is initialized
        checkIsInitialized(rootDir);

        // Load configuration
        const config = await loadConfig(rootDir);

        // Load existing passages metadata
        const metadata = await loadPassagesMetadata(rootDir);

        // Find all TypeScript files
        const files = await findTypeScriptFiles(rootDir, config);

        // Scan all files for passages
        const allPassages = new Map<string, PassageSourceData>();
        const allConnections: ConnectionSourceData[] = [];
        const fileToPassagesMap = new Map<string, string[]>(); // Maps filePath -> passageIds[]

        for (const file of files) {
            try {
                const passages = await parseFileForPassages(file);
                const passagesInFile: string[] = [];

                for (const passage of passages) {
                    // If duplicate ID, keep the first one found
                    if (!allPassages.has(passage.id)) {
                        allPassages.set(passage.id, passage);
                        passagesInFile.push(passage.id);
                    } else {
                        errors.push(
                            `Warning: Duplicate passage ID '${passage.id}' found in ${file}:${passage.lineNumber}. Ignoring duplicate.`
                        );
                    }
                }

                // Store all passages from this file
                if (passagesInFile.length > 0) {
                    fileToPassagesMap.set(file, passagesInFile);
                }
            } catch (error) {
                errors.push(
                    `Warning: ${file}: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }

        found = allPassages.size;

        // Scan all files for connections
        for (const file of files) {
            try {
                const connections = await parseFileForConnections(file);
                allConnections.push(...connections);
            } catch (error) {
                errors.push(
                    `Warning: ${file}: ${error instanceof Error ? error.message : String(error)}`
                );
            }
        }

        // Track which passages exist in source
        const sourcePassageIds = new Set(allPassages.keys());

        // Update metadata
        const newMetadata: PassagesMetadata = { passages: {} };

        // Find the last used position for new passages
        let lastPosition = findLastPosition(metadata.passages);

        // Add/update passages from source
        for (const [id] of allPassages) {
            const existingMetadata = metadata.passages[id];

            if (existingMetadata) {
                // Update existing passage (preserve ALL metadata including position)
                newMetadata.passages[id] = {
                    ...existingMetadata,
                    id, // Ensure ID matches
                };
                updated++;
            } else {
                // Add new passage with next sequential position
                lastPosition = getNextPosition(lastPosition);

                newMetadata.passages[id] = {
                    id,
                    source: "code", // Mark scanned passages as user-created
                    position: lastPosition,
                };
                added++;
            }
        }

        // Remove passages that no longer exist in source
        for (const id of Object.keys(metadata.passages)) {
            if (!sourcePassageIds.has(id)) {
                removed++;
            }
        }

        // Build connections array with 'from' determined by file-to-passage mapping
        const connections: PassageConnection[] = allConnections.map(
            (conn) => {
                const passagesInFile = fileToPassagesMap.get(conn.filePath);

                if (!passagesInFile || passagesInFile.length === 0) {
                    // No passages in this file, mark as _CODE
                    return {
                        from: "_CODE",
                        to: conn.to,
                    };
                }

                if (passagesInFile.length === 1) {
                    // Single passage in file, use it
                    return {
                        from: passagesInFile[0],
                        to: conn.to,
                    };
                }

                // Multiple passages in file - find the closest one by line number
                let closestPassageId = passagesInFile[0];
                let closestDistance = Number.MAX_SAFE_INTEGER;

                for (const passageId of passagesInFile) {
                    const passage = allPassages.get(passageId);
                    if (passage) {
                        const distance = Math.abs(
                            passage.lineNumber - conn.lineNumber
                        );
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestPassageId = passageId;
                        }
                    }
                }

                return {
                    from: closestPassageId,
                    to: conn.to,
                };
            }
        );

        // Add connections to metadata
        newMetadata.connections = connections;

        // Find and add start passage to settings
        const startPassage = await findStartPassage(rootDir, files);
        const finalStartPassage = startPassage || "start-passage";

        newMetadata.settings = {
            startPassage: finalStartPassage,
        };

        // Ensure the start passage exists in the passages object
        // If not found in scanned code, create a placeholder passage with source: "tool"
        if (!newMetadata.passages[finalStartPassage]) {
            // Get next position for the start passage
            lastPosition = getNextPosition(lastPosition);

            newMetadata.passages[finalStartPassage] = {
                id: finalStartPassage,
                source: "tool", // Mark as tool-created so it's editable in UI
                position: lastPosition,
            };

            added++;
        }

        // Save updated metadata
        await savePassagesMetadata(rootDir, newMetadata);

        return {
            success: true,
            message: "Scan completed successfully",
            found,
            added,
            updated,
            removed,
            errors,
        };
    } catch (error) {
        return {
            success: false,
            message: `Scan failed: ${error instanceof Error ? error.message : String(error)}`,
            found: 0,
            added: 0,
            updated: 0,
            removed: 0,
            errors,
        };
    }
}
