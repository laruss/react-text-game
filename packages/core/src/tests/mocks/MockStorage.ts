import type { GameSaveState } from "#types";

/**
 * Mock storage implementation for testing.
 * Provides an in-memory storage that mimics the Storage class API.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: Mirrors the public static Storage API used by tests.
export class MockStorage {
    private static state: GameSaveState = {};

    static getValue<T>(jsonPath: string): Array<T> {
        const path = jsonPath.replace(/^\$\./, "").split(".");
        let current = MockStorage.state;

        for (const key of path) {
            if (current && typeof current === "object" && key in current) {
                current = current[key] as GameSaveState;
            } else {
                return [];
            }
        }

        return [current] as Array<T>;
    }

    static setValue<T>(jsonPath: string, value: T, _isSystem = false): void {
        const path = jsonPath.replace(/^\$\./, "").split(".");
        let current = MockStorage.state;

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (key === undefined) {
                throw new Error(`Invalid storage path: ${jsonPath}`);
            }
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key] as GameSaveState;
        }

        const finalKey = path.at(-1);
        if (finalKey === undefined) {
            throw new Error(`Invalid storage path: ${jsonPath}`);
        }
        current[finalKey] = value;
    }

    static getState(): GameSaveState {
        return JSON.parse(JSON.stringify(MockStorage.state));
    }

    static setState(state: GameSaveState): void {
        MockStorage.state = JSON.parse(JSON.stringify(state));
    }

    static reset(): void {
        MockStorage.state = {};
    }
}
