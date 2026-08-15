/**
 * Mock implementation of Dexie for testing environments
 * Provides an in-memory implementation of IndexedDB functionality
 */

interface DexieTable<T = Record<string, unknown>> {
    add(item: T): Promise<number>;
    put(item: T): Promise<number>;
    delete(id: number): Promise<void>;
    where(query: Record<string, unknown> | string): DexieWhereClause<T>;
    filter(callback: (item: T) => boolean): DexieCollection<T>;
    toArray(): Promise<T[]>;
    toCollection(): DexieModifiableCollection<T>;
    clear(): Promise<void>;
    update(id: number, changes: Partial<T>): Promise<number>;
}

interface DexieModifiableCollection<T = Record<string, unknown>> {
    modify(changer: (item: T) => void): Promise<number>;
}

interface DexieWhereClause<T = Record<string, unknown>> {
    equals(value: unknown): DexieCollection<T>;
    first(): Promise<T | undefined>;
    toArray(): Promise<T[]>;
    delete(): Promise<void>;
}

interface DexieCollection<T = Record<string, unknown>> {
    first(): Promise<T | undefined>;
    toArray(): Promise<T[]>;
    delete(): Promise<void>;
    reverse(): DexieCollection<T>;
    sortBy(key: keyof T): Promise<T[]>;
}

function compareValues(left: unknown, right: unknown): number {
    if (left instanceof Date && right instanceof Date) {
        return left.getTime() - right.getTime();
    }
    if (typeof left === "number" && typeof right === "number") {
        return left - right;
    }
    return String(left).localeCompare(String(right));
}

class MockDexieTable<
    T extends { id?: number } = Record<string, unknown> & { id?: number },
> implements DexieTable<T>
{
    private data: Map<number, T> = new Map();
    private nextId = 1;

    async add(item: T): Promise<number> {
        const id = this.nextId++;
        this.data.set(id, { ...item, id } as T);
        return id;
    }

    /**
     * Writes a whole record, replacing any row that carries the same id.
     *
     * @remarks
     * Unlike {@link MockDexieTable.update} this does not merge: keys absent
     * from `item` are gone from the stored row afterwards, the way Dexie's
     * `put` behaves.
     */
    async put(item: T): Promise<number> {
        const { id } = item;
        if (id === undefined) {
            return this.add(item);
        }
        this.data.set(id, { ...item });
        if (id >= this.nextId) {
            this.nextId = id + 1;
        }
        return id;
    }

    async delete(id: number): Promise<void> {
        this.data.delete(id);
    }

    where(query: Record<string, unknown> | string): DexieWhereClause<T> {
        const data = this.data;
        const queryKey =
            typeof query === "string" ? query : Object.keys(query)[0];
        const queryValue =
            typeof query === "string" ? undefined : Object.values(query)[0];
        const createCollection = this.createCollection.bind(this);
        const selectedItems = () =>
            Array.from(data.values()).filter(
                (item: T) =>
                    (item as Record<string, unknown>)[queryKey as string] ===
                    queryValue
            );

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
                return selectedItems()[0];
            },
            async toArray(): Promise<T[]> {
                return selectedItems();
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

    toCollection(): DexieModifiableCollection<T> {
        const data = this.data;
        return {
            async modify(changer: (item: T) => void): Promise<number> {
                for (const [id, item] of data.entries()) {
                    // Dexie hands the changer a draft and writes back whatever
                    // it leaves behind, deleted keys included.
                    const draft = { ...item };
                    changer(draft);
                    data.set(id, draft);
                }
                return data.size;
            },
        };
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
        let direction: 1 | -1 = 1;
        const orderedItems = () =>
            direction === 1 ? [...items] : [...items].reverse();
        const collection: DexieCollection<T> = {
            async first(): Promise<T | undefined> {
                return orderedItems()[0];
            },
            async toArray(): Promise<T[]> {
                return orderedItems();
            },
            async delete(): Promise<void> {
                // In a real implementation, this would delete from the parent table
                // For testing purposes, this is sufficient
            },
            reverse(): DexieCollection<T> {
                direction = direction === 1 ? -1 : 1;
                return collection;
            },
            async sortBy(key: keyof T): Promise<T[]> {
                return [...items].sort(
                    (left, right) =>
                        direction * compareValues(left[key], right[key])
                );
            },
        };

        return collection;
    }
}

interface MockDexieTransaction {
    table(name: string): MockDexieTable;
}

interface MockDexieVersion {
    stores: (schema: Record<string, string>) => MockDexieVersion;
    upgrade: (
        handler: (transaction: MockDexieTransaction) => unknown
    ) => MockDexieVersion;
}

class MockDexie {
    [key: string]: unknown;

    /**
     * Databases constructed so far, keyed by name, so `Dexie.exists` can answer
     * the way it does in a browser: a database exists once something has opened
     * it.
     */
    private static readonly registry = new Map<string, MockDexie>();

    /**
     * The schema version each database was last left at, so a connection that
     * declares a higher one upgrades it the way a real open does.
     */
    private static readonly storedVersions = new Map<string, number>();

    /** Every connection opened so far - see {@link MockDexie.__opens}. */
    private static readonly opens: Array<{ name: string; maxVersion: number }> =
        [];

    private tables: Map<string, MockDexieTable> = new Map();
    private transactionQueue: Promise<void> = Promise.resolve();
    private upgrades: Array<(transaction: MockDexieTransaction) => unknown> =
        [];
    /** Version this database was already at when this connection opened it. */
    private openedAtVersion = 0;
    /** This connection's entry in {@link MockDexie.opens}. */
    private openRecord: { name: string; maxVersion: number } = {
        name: "",
        maxVersion: 0,
    };

    constructor(name = "") {
        this.name = name;
        this.openRecord = { name, maxVersion: 0 };
        MockDexie.opens.push(this.openRecord);

        // A second connection to the same database name sees the rows the
        // first one wrote, the way two Dexie instances over one IndexedDB do.
        const existing = MockDexie.registry.get(name);
        if (existing) {
            this.tables = existing.tables;
        }

        this.openedAtVersion = MockDexie.storedVersions.get(name) ?? 0;
        MockDexie.registry.set(name, this);
    }

    static async exists(name: string): Promise<boolean> {
        return MockDexie.registry.has(name);
    }

    /**
     * Test-only: every connection opened so far, in order, with the highest
     * schema version it declared.
     *
     * @remarks
     * Opening a database with a version above the one it was left at rewrites
     * its rows and locks out every build that declares a lower one. A test can
     * slice this log around a call to assert which databases that call opened,
     * and under which schema.
     */
    static __opens(): ReadonlyArray<{ name: string; maxVersion: number }> {
        return MockDexie.opens.map((open) => ({ ...open }));
    }

    /** Releases the connection. The mock keeps the data, as IndexedDB does. */
    close(): void {}

    version(versionNumber: number): MockDexieVersion {
        // A connection declaring a version above the one the database was left
        // at upgrades it, exactly as opening it in a browser would.
        const upgradesThisDatabase =
            this.openedAtVersion > 0 && versionNumber > this.openedAtVersion;
        this.openRecord.maxVersion = Math.max(
            this.openRecord.maxVersion,
            versionNumber
        );
        MockDexie.storedVersions.set(
            this.name as string,
            Math.max(
                MockDexie.storedVersions.get(this.name as string) ?? 0,
                versionNumber
            )
        );

        const versionObj: MockDexieVersion = {
            stores: (schema: Record<string, string>): MockDexieVersion => {
                // Initialize tables based on schema
                for (const tableName of Object.keys(schema)) {
                    let table = this.tables.get(tableName);
                    if (!table) {
                        table = new MockDexieTable();
                        this.tables.set(tableName, table);
                    }
                    // Make the table accessible as a property. Re-assigned
                    // every time: a subclass's own field declarations are
                    // initialized after `super()` and blank it out otherwise.
                    this[tableName] = table;
                }
                return versionObj;
            },
            upgrade: (
                handler: (transaction: MockDexieTransaction) => unknown
            ): MockDexieVersion => {
                this.upgrades.push(handler);
                if (upgradesThisDatabase) {
                    // `stores()` has already run, so the tables exist. The
                    // handlers this mock serves rewrite rows synchronously.
                    void handler(this.upgradeTransaction());
                }
                return versionObj;
            },
        };

        return versionObj;
    }

    /**
     * Runs the registered `upgrade` handlers.
     *
     * @remarks
     * A real Dexie runs these while opening a database whose stored version is
     * older. The mock has no persistence to be older than, so tests that need
     * to exercise an upgrade call this explicitly after seeding legacy rows.
     */
    async runUpgrades(): Promise<void> {
        const transaction = this.upgradeTransaction();

        for (const upgrade of this.upgrades) {
            await upgrade(transaction);
        }
    }

    private upgradeTransaction(): MockDexieTransaction {
        return {
            table: (name: string) => {
                const table = this.tables.get(name);
                if (!table) throw new Error(`Unknown table "${name}"`);
                return table;
            },
        };
    }

    transaction<T>(
        _mode: "rw",
        _table: unknown,
        scope: () => Promise<T> | T
    ): Promise<T> {
        const result = this.transactionQueue.then(scope);
        this.transactionQueue = result.then(
            () => undefined,
            () => undefined
        );
        return result;
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
