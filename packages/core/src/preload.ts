export type PreloadAssetType = "auto" | "image" | "fetch";

export type PreloadSource = Readonly<{
    id?: string;
    src: string;
    type?: PreloadAssetType;
    requestInit?: Omit<RequestInit, "signal">;
    srcSet?: string;
    sizes?: string;
    crossOrigin?: "anonymous" | "use-credentials";
}>;

export type PreloadTask = Readonly<{
    id: string;
    load: (signal: AbortSignal) => Promise<unknown>;
}>;

export type PreloadAsset = string | PreloadSource | PreloadTask;

export type PreloadProgress = Readonly<{
    completed: number;
    failed: number;
    progress: number;
    succeeded: number;
    total: number;
    current?: PreloadAsset;
}>;

export type PreloadFailure = Readonly<{
    asset: PreloadAsset;
    error: unknown;
}>;

export type PreloadResult = Readonly<{
    completed: number;
    failures: ReadonlyArray<PreloadFailure>;
    failed: number;
    succeeded: number;
    total: number;
}>;

export type PreloadOptions = Readonly<{
    concurrency?: number;
    onProgress?: (progress: PreloadProgress) => void;
    signal?: AbortSignal;
}>;

const DEFAULT_CONCURRENCY = 6;
const IMAGE_EXTENSION = /\.(?:avif|bmp|gif|ico|jpe?g|png|svg|webp)(?:$|[?#])/i;

const getAssetKey = (asset: PreloadAsset): string => {
    if (typeof asset === "string") {
        return `src:${asset}`;
    }

    if ("load" in asset) {
        return `task:${asset.id}`;
    }

    return `src:${asset.src}`;
};

const deduplicateAssets = (
    assets: ReadonlyArray<PreloadAsset>
): Array<PreloadAsset> => {
    const seen = new Set<string>();

    return assets.filter((asset) => {
        const key = getAssetKey(asset);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};

const abortError = (signal: AbortSignal): unknown =>
    signal.reason ?? new DOMException("Preloading was aborted", "AbortError");

const throwIfAborted = (signal: AbortSignal): void => {
    if (signal.aborted) {
        throw abortError(signal);
    }
};

const loadImage = (
    source: string | PreloadSource,
    signal: AbortSignal
): Promise<void> =>
    new Promise((resolve, reject) => {
        throwIfAborted(signal);

        const src = typeof source === "string" ? source : source.src;
        const image = new Image();
        let settled = false;

        const cleanup = () => {
            image.onload = null;
            image.onerror = null;
            signal.removeEventListener("abort", onAbort);
        };
        const settle = (callback: () => void) => {
            if (settled) {
                return;
            }
            settled = true;
            cleanup();
            callback();
        };
        const onAbort = () => {
            image.src = "";
            settle(() => reject(abortError(signal)));
        };

        image.decoding = "async";
        if (typeof source !== "string") {
            if (source.crossOrigin) {
                image.crossOrigin = source.crossOrigin;
            }
            if (source.sizes) {
                image.sizes = source.sizes;
            }
            if (source.srcSet) {
                image.srcset = source.srcSet;
            }
        }

        image.onload = () => {
            const decoded = image.decode?.();
            if (!decoded) {
                settle(resolve);
                return;
            }
            decoded.then(
                () => settle(resolve),
                (error) => settle(() => reject(error))
            );
        };
        image.onerror = () =>
            settle(() => reject(new Error(`Failed to preload image: ${src}`)));
        signal.addEventListener("abort", onAbort, { once: true });
        image.src = src;
    });

const loadWithFetch = async (
    source: string | PreloadSource,
    signal: AbortSignal
): Promise<void> => {
    const src = typeof source === "string" ? source : source.src;
    const requestInit =
        typeof source === "string" ? undefined : source.requestInit;
    const response = await fetch(src, { ...requestInit, signal });

    if (!response.ok) {
        throw new Error(
            `Failed to preload resource: ${src} (${response.status} ${response.statusText})`
        );
    }

    await response.arrayBuffer();
};

const shouldLoadAsImage = (asset: string | PreloadSource): boolean => {
    if (typeof asset !== "string" && asset.type && asset.type !== "auto") {
        return asset.type === "image";
    }

    const src = typeof asset === "string" ? asset : asset.src;
    return IMAGE_EXTENSION.test(src);
};

const loadAsset = async (
    asset: PreloadAsset,
    signal: AbortSignal
): Promise<void> => {
    throwIfAborted(signal);

    if (typeof asset !== "string" && "load" in asset) {
        await asset.load(signal);
        return;
    }

    if (shouldLoadAsImage(asset) && typeof Image !== "undefined") {
        await loadImage(asset, signal);
        return;
    }

    await loadWithFetch(asset, signal);
};

const getConcurrency = (concurrency: number | undefined): number => {
    if (!Number.isFinite(concurrency) || !concurrency || concurrency < 1) {
        return DEFAULT_CONCURRENCY;
    }
    return Math.floor(concurrency);
};

/**
 * Preloads and fully consumes a list of game assets with bounded concurrency.
 * Duplicate sources are loaded once, individual failures are collected, and an
 * aborted signal rejects the operation immediately.
 */
export const preloadContent = async (
    assets: ReadonlyArray<PreloadAsset>,
    options: PreloadOptions = {}
): Promise<PreloadResult> => {
    const uniqueAssets = deduplicateAssets(assets);
    const signal = options.signal ?? new AbortController().signal;

    throwIfAborted(signal);

    const total = uniqueAssets.length;
    const failuresByIndex: Array<PreloadFailure | undefined> = new Array(total);
    let cursor = 0;
    let completed = 0;
    let failed = 0;

    const reportProgress = (current?: PreloadAsset) => {
        options.onProgress?.({
            completed,
            failed,
            progress: total === 0 ? 1 : completed / total,
            succeeded: completed - failed,
            total,
            ...(current === undefined ? {} : { current }),
        });
    };

    reportProgress();

    const worker = async () => {
        while (true) {
            throwIfAborted(signal);
            const index = cursor++;
            const asset = uniqueAssets[index];
            if (asset === undefined) {
                return;
            }

            try {
                await loadAsset(asset, signal);
            } catch (error) {
                if (signal.aborted) {
                    throw abortError(signal);
                }
                failed++;
                failuresByIndex[index] = { asset, error };
            }

            completed++;
            reportProgress(asset);
        }
    };

    const workerCount = Math.min(getConcurrency(options.concurrency), total);
    await Promise.all(Array.from({ length: workerCount }, worker));

    const failures = failuresByIndex.filter(
        (failure): failure is PreloadFailure => failure !== undefined
    );

    return {
        completed,
        failures,
        failed,
        succeeded: completed - failed,
        total,
    };
};
