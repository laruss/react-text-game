/**
 * Mock implementation of Dexie for testing environments
 * Provides an in-memory implementation of IndexedDB functionality
 */

interface DexieTable<T = Record<string, unknown>> {
    add(item: T): Promise<number>;
    where(query: Record<string, unknown> | string): DexieWhereClause<T>;
    filter(callback: (item: T) => boolean): DexieCollection<T>;
    toArray(): Promise<T[]>;
    clear(): Promise<void>;
    update(id: number, changes: Partial<T>): Promise<number>;
}

interface DexieWhereClause<T = Record<string, unknown>> {
    equals(value: unknown): DexieCollection<T>;
    first(): Promise<T | undefined>;
    delete(): Promise<void>;
}

interface DexieCollection<T = Record<string, unknown>> {
    first(): Promise<T | undefined>;
    toArray(): Promise<T[]>;
    delete(): Promise<void>;
}

class MockDexieTable<
    T extends { id?: number } = Record<string, unknown> & { id?: number },
> implements DexieTable<T>
{
    private data: Map<number, T> = new Map();
    private nextId = 1;
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    async add(item: T): Promise<number> {
        const id = this.nextId++;
        this.data.set(id, { ...item, id } as T);
        return id;
    }

    where(query: Record<string, unknown> | string): DexieWhereClause<T> {
        const data = this.data;
        const queryKey =
            typeof query === "string" ? query : Object.keys(query)[0];
        const queryValue =
            typeof query === "string" ? undefined : Object.values(query)[0];
        const createCollection = this.createCollection.bind(this);

        return {
            equals(value: unknown): DexieCollection<T> {
                const val = queryValue ?? value;
                return createCollection(
                    Array.from(data.values()).filter(
                        (item: T) =>
                            (item as Record<string, unknown>)[
                                queryKey as string
                            ] === val
                    )
                );
            },
            async first(): Promise<T | undefined> {
                const items = Array.from(data.values()).filter(
                    (item: T) =>
                        (item as Record<string, unknown>)[
                            queryKey as string
                        ] === queryValue
                );
                return items[0];
            },
            async delete(): Promise<void> {
                const itemsToDelete = Array.from(data.entries()).filter(
                    ([, item]: [number, T]) =>
                        (item as Record<string, unknown>)[
                            queryKey as string
                        ] === queryValue
                );
                for (const [id] of itemsToDelete) {
                    data.delete(id);
                }
            },
        };
    }

    filter(callback: (item: T) => boolean): DexieCollection<T> {
        return this.createCollection(
            Array.from(this.data.values()).filter(callback)
        );
    }

    async toArray(): Promise<T[]> {
        return Array.from(this.data.values());
    }

    async clear(): Promise<void> {
        this.data.clear();
    }

    async update(id: number, changes: Partial<T>): Promise<number> {
        const existing = this.data.get(id);
        if (existing) {
            this.data.set(id, { ...existing, ...changes });
            return 1;
        }
        return 0;
    }

    private createCollection(items: T[]): DexieCollection<T> {
        return {
            async first(): Promise<T | undefined> {
                return items[0];
            },
            async toArray(): Promise<T[]> {
                return items;
            },
            async delete(): Promise<void> {
                // In a real implementation, this would delete from the parent table
                // For testing purposes, this is sufficient
            },
        };
    }
}

interface MockDexieVersion {
    stores: (schema: Record<string, string>) => MockDexieVersion;
}

class MockDexie {
    [key: string]: unknown;
    private tables: Map<string, MockDexieTable> = new Map();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(_databaseName: string) {
        // Store database name for potential debugging
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    version(_versionNumber: number): MockDexieVersion {
        const versionObj: MockDexieVersion = {
            stores: (schema: Record<string, string>): MockDexieVersion => {
                // Initialize tables based on schema
                for (const tableName of Object.keys(schema)) {
                    if (!this.tables.has(tableName)) {
                        const table = new MockDexieTable(tableName);
                        this.tables.set(tableName, table);
                        // Make table accessible as property
                        this[tableName] = table;
                    }
                }
                return versionObj;
            },
        };

        return versionObj;
    }
}

// Mock the useLiveQuery hook from dexie-react-hooks
export function useLiveQuery<T>(querier: () => Promise<T> | T): T | undefined {
    // In tests, we'll just return undefined or execute the querier synchronously
    // This is a simplified version - adjust based on your testing needs
    try {
        const result = querier();
        if (result instanceof Promise) {
            return undefined; // Return undefined for async queries in tests
        }
        return result;
    } catch {
        return undefined;
    }
}

// Export default Dexie class
export default MockDexie;

// Export EntityTable type for compatibility
export type EntityTable<
    T extends { id?: number },
    K extends keyof T,
> = MockDexieTable<T> & {
    // Dummy field to use K and avoid unused type parameter warning
    readonly __primaryKey?: K;
};
