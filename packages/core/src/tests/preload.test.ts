import { afterEach, describe, expect, mock, test } from "bun:test";

import { type PreloadProgress, preloadContent } from "#preload";

const originalFetch = globalThis.fetch;
const OriginalImage = globalThis.Image;

const response = (ok = true, status = 200, statusText = "OK"): Response =>
    ({
        ok,
        status,
        statusText,
        arrayBuffer: mock(async () => new ArrayBuffer(0)),
    }) as unknown as Response;

afterEach(() => {
    globalThis.fetch = originalFetch;
    globalThis.Image = OriginalImage;
});

describe("preloadContent", () => {
    test("fetches unique resources, consumes their bodies and reports progress", async () => {
        const first = response();
        const second = response();
        const fetchMock = mock(async (src: string) =>
            src === "/one.json" ? first : second
        );
        globalThis.fetch = fetchMock as unknown as typeof fetch;
        const progress: Array<PreloadProgress> = [];

        const result = await preloadContent(
            ["/one.json", "/one.json", "/two.mp3"],
            { onProgress: (value) => progress.push(value) }
        );

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(first.arrayBuffer).toHaveBeenCalledTimes(1);
        expect(second.arrayBuffer).toHaveBeenCalledTimes(1);
        expect(progress[0]).toEqual({
            completed: 0,
            failed: 0,
            progress: 0,
            succeeded: 0,
            total: 2,
        });
        expect(progress.at(-1)).toMatchObject({
            completed: 2,
            failed: 0,
            progress: 1,
            succeeded: 2,
            total: 2,
        });
        expect(result).toEqual({
            completed: 2,
            failed: 0,
            failures: [],
            succeeded: 2,
            total: 2,
        });
    });

    test("collects failed resources without blocking the remaining queue", async () => {
        globalThis.fetch = mock(async (src: string) =>
            src === "/broken.bin"
                ? response(false, 404, "Not Found")
                : response()
        ) as unknown as typeof fetch;

        const result = await preloadContent(["/broken.bin", "/working.bin"]);

        expect(result.completed).toBe(2);
        expect(result.succeeded).toBe(1);
        expect(result.failed).toBe(1);
        expect(result.failures[0]?.asset).toBe("/broken.bin");
        expect(result.failures[0]?.error).toEqual(
            new Error("Failed to preload resource: /broken.bin (404 Not Found)")
        );
    });

    test("passes request options and the shared abort signal to fetch", async () => {
        const fetchMock = mock(async () => response());
        globalThis.fetch = fetchMock as unknown as typeof fetch;
        const controller = new AbortController();

        await preloadContent(
            [
                {
                    src: "/content.json",
                    type: "fetch",
                    requestInit: { credentials: "include", cache: "reload" },
                },
            ],
            { signal: controller.signal }
        );

        expect(fetchMock).toHaveBeenCalledWith("/content.json", {
            cache: "reload",
            credentials: "include",
            signal: controller.signal,
        });
    });

    test("limits custom tasks to the configured concurrency", async () => {
        let active = 0;
        let maximumActive = 0;
        const makeTask = (id: string) => ({
            id,
            load: async () => {
                active++;
                maximumActive = Math.max(maximumActive, active);
                await new Promise((resolve) => setTimeout(resolve, 5));
                active--;
            },
        });

        const result = await preloadContent(
            [makeTask("one"), makeTask("two"), makeTask("three")],
            { concurrency: 2 }
        );

        expect(maximumActive).toBe(2);
        expect(result.succeeded).toBe(3);
    });

    test("deduplicates source URLs and custom task ids", async () => {
        const fetchMock = mock(async () => response());
        globalThis.fetch = fetchMock as unknown as typeof fetch;
        const task = mock(async () => {});

        const result = await preloadContent([
            { id: "first-label", src: "/same.bin" },
            { id: "second-label", src: "/same.bin" },
            { id: "same-task", load: task },
            { id: "same-task", load: task },
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(task).toHaveBeenCalledTimes(1);
        expect(result.total).toBe(2);
    });

    test("loads and decodes inferred and explicit images", async () => {
        const instances: Array<FakeImage> = [];
        class FakeImage {
            crossOrigin = "";
            decoding = "auto";
            onerror: null | (() => void) = null;
            onload: null | (() => void) = null;
            sizes = "";
            srcset = "";
            private value = "";

            constructor() {
                instances.push(this);
            }

            decode = mock(async () => {});

            get src() {
                return this.value;
            }

            set src(value: string) {
                this.value = value;
                if (value) {
                    queueMicrotask(() => this.onload?.());
                }
            }
        }
        globalThis.Image = FakeImage as unknown as typeof Image;

        const result = await preloadContent([
            "/cover.webp?version=1",
            {
                src: "/hero",
                type: "image",
                srcSet: "/hero-small.webp 480w, /hero.webp 960w",
                sizes: "100vw",
                crossOrigin: "anonymous",
            },
        ]);

        expect(result.succeeded).toBe(2);
        expect(instances[0]?.decoding).toBe("async");
        expect(instances[0]?.decode).toHaveBeenCalledTimes(1);
        expect(instances[1]).toMatchObject({
            crossOrigin: "anonymous",
            sizes: "100vw",
            srcset: "/hero-small.webp 480w, /hero.webp 960w",
        });
    });

    test("records image load and decode errors", async () => {
        let count = 0;
        class FakeImage {
            decoding = "auto";
            onerror: null | (() => void) = null;
            onload: null | (() => void) = null;
            private value = "";

            decode = () =>
                count++ === 0
                    ? Promise.reject(new Error("decode failed"))
                    : undefined;

            get src() {
                return this.value;
            }

            set src(value: string) {
                this.value = value;
                if (!value) {
                    return;
                }
                queueMicrotask(() => {
                    if (value.includes("broken")) {
                        this.onerror?.();
                    } else {
                        this.onload?.();
                    }
                });
            }
        }
        globalThis.Image = FakeImage as unknown as typeof Image;

        const result = await preloadContent([
            "/decode.png",
            "/without-decode.png",
            "/broken.png",
        ]);

        expect(result.failed).toBe(2);
        expect(result.succeeded).toBe(1);
        expect(result.failures[0]?.error).toEqual(new Error("decode failed"));
        expect(result.failures[1]?.error).toEqual(
            new Error("Failed to preload image: /broken.png")
        );
    });

    test("falls back to fetch for images when the Image API is unavailable", async () => {
        globalThis.Image = undefined as unknown as typeof Image;
        const fetchMock = mock(async () => response());
        globalThis.fetch = fetchMock as unknown as typeof fetch;

        await preloadContent([{ src: "/image.png", type: "auto" }]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test("rejects immediately when already aborted", async () => {
        const controller = new AbortController();
        const reason = new Error("stop");
        controller.abort(reason);

        expect(
            preloadContent(["/asset.json"], { signal: controller.signal })
        ).rejects.toBe(reason);
    });

    test("aborts an in-flight image and stops queued work", async () => {
        let latest: FakeImage | undefined;
        class FakeImage {
            decoding = "auto";
            onerror: null | (() => void) = null;
            onload: null | (() => void) = null;
            src = "";

            constructor() {
                latest = this;
            }
        }
        globalThis.Image = FakeImage as unknown as typeof Image;
        const controller = new AbortController();
        const loading = preloadContent(["/slow.png", "/queued.png"], {
            concurrency: 1,
            signal: controller.signal,
        });

        controller.abort();

        await expect(loading).rejects.toHaveProperty("name", "AbortError");
        expect(latest?.src).toBe("");
    });

    test("handles empty lists and invalid concurrency values", async () => {
        const progress: Array<PreloadProgress> = [];

        const result = await preloadContent([], {
            concurrency: Number.NaN,
            onProgress: (value) => progress.push(value),
        });

        expect(result).toEqual({
            completed: 0,
            failed: 0,
            failures: [],
            succeeded: 0,
            total: 0,
        });
        expect(progress).toEqual([
            {
                completed: 0,
                failed: 0,
                progress: 1,
                succeeded: 0,
                total: 0,
            },
        ]);
    });
});
