import { GameSaveState } from "#types";

/**
 * Mock storage implementation for testing.
 * Provides an in-memory storage that mimics the Storage class API.
 */
export class MockStorage {
    private static state: GameSaveState = {};

    static getValue<T>(jsonPath: string): Array<T> {
        const path = jsonPath.replace(/^\$\./, "").split(".");
        let current = this.state;

        for (const key of path) {
            if (current && typeof current === "object" && key in current) {
                current = current[key] as GameSaveState;
            } else {
                return [];
            }
        }

        return [current] as Array<T>;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static setValue<T>(jsonPath: string, value: T, _isSystem = false): void {
        const path = jsonPath.replace(/^\$\./, "").split(".");
        let current = this.state;

        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (!(key! in current)) {
                current[key!] = {};
            }
            current = current[key!] as GameSaveState;
        }

        current[path[path.length - 1]!] = value;
    }

    static getState(): GameSaveState {
        return JSON.parse(JSON.stringify(this.state));
    }

    static setState(state: GameSaveState): void {
        this.state = JSON.parse(JSON.stringify(state));
    }

    static reset(): void {
        this.state = {};
    }
}
