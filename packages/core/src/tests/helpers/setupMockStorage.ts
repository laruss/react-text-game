import { Storage } from "#storage";
import { MockStorage } from "#tests/mocks";

// Store original Storage methods
const originalStorageMethods = {
    getValue: Storage.getValue.bind(Storage),
    setValue: Storage.setValue.bind(Storage),
    getState: Storage.getState.bind(Storage),
    setState: Storage.setState.bind(Storage),
};

/**
 * Replaces Storage methods with MockStorage implementation
 * and resets the mock storage state.
 */
export function setupMockStorage(): void {
    Storage.getValue = MockStorage.getValue.bind(MockStorage);
    Storage.setValue = MockStorage.setValue.bind(MockStorage);
    Storage.getState = MockStorage.getState.bind(MockStorage);
    Storage.setState = MockStorage.setState.bind(MockStorage);

    MockStorage.reset();
}

/**
 * Restores original Storage methods and resets mock storage state.
 */
export function teardownMockStorage(): void {
    MockStorage.reset();

    Storage.getValue = originalStorageMethods.getValue;
    Storage.setValue = originalStorageMethods.setValue;
    Storage.getState = originalStorageMethods.getState;
    Storage.setState = originalStorageMethods.setState;
}
