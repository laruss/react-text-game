import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { mock } from "bun:test";

GlobalRegistrator.register();

// Mock Dexie and dexie-react-hooks to avoid IndexedDB errors in tests
mock.module("dexie", async () => {
    const MockDexie = (await import("./packages/ui/src/tests/dexie.mock"))
        .default;
    const { EntityTable } = await import("./packages/ui/src/tests/dexie.mock");
    return {
        default: MockDexie,
        EntityTable,
    };
});

mock.module("dexie-react-hooks", async () => {
    const { useLiveQuery } = await import("./packages/ui/src/tests/dexie.mock");
    return {
        useLiveQuery,
    };
});
