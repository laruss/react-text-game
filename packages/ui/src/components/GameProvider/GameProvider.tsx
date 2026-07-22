"use client";

import {
    Game,
    type NewOptions,
    newWidget,
    type PreloadAsset,
    type PreloadProgress,
    type PreloadResult,
    preloadContent,
    SYSTEM_PASSAGE_NAMES,
} from "@react-text-game/core";
import {
    createElement,
    type PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";

import { ErrorBoundary } from "#components/ErrorBoundary";
import {
    LoadingScreen,
    type LoadingScreenOptions,
} from "#components/LoadingScreen";
import { MainMenu } from "#components/MainMenu";
import { SaveLoadModal } from "#components/SaveLoadModal";
import {
    RTGSplashScreen,
    type SplashScreenConfig,
    SplashScreenSequence,
} from "#components/SplashScreen";
import {
    type Components,
    ComponentsProvider,
} from "#context/ComponentsContext";
import {
    SaveLoadMenuProvider,
    useSaveLoadMenu,
} from "#context/SaveLoadMenuContext";

import { DevModeDrawer } from "../DevModeDrawer";
import { AppIconMenu } from "./AppIconMenu";

export type GameProviderProps = PropsWithChildren<{
    components?: Components;
    loadingScreen?: LoadingScreenOptions;
    onPreloadComplete?: (result: PreloadResult) => void;
    options: NewOptions;
    preload?: ReadonlyArray<PreloadAsset>;
    preloadConcurrency?: number;
    showRTGSplashScreen?: boolean;
    showSplashScreen?: boolean;
    showSplashScreenOnDev?: boolean;
    splashScreens?: ReadonlyArray<SplashScreenConfig>;
}>;

type BootstrapPhase = "initializing" | "loading" | "ready" | "splash";

const createInitialProgress = (
    preload: ReadonlyArray<PreloadAsset>
): PreloadProgress => ({
    completed: 0,
    failed: 0,
    progress: 0,
    succeeded: 0,
    total: preload.length,
});

const SaveLoadModalWrapper = () => {
    const { isOpen, mode, close } = useSaveLoadMenu();
    return <SaveLoadModal isOpen={isOpen} onClose={close} mode={mode} />;
};

export const GameProvider = ({
    children,
    options,
    components = {},
    loadingScreen,
    onPreloadComplete,
    preload = [],
    preloadConcurrency,
    showRTGSplashScreen = true,
    showSplashScreen = true,
    showSplashScreenOnDev = false,
    splashScreens = [],
}: GameProviderProps) => {
    const [internalOptions, setInternalOptions] = useState<NewOptions>(options);
    const [isInitialized, setIsInitialized] = useState(false);
    const [phase, setPhase] = useState<BootstrapPhase>(
        preload.length ? "loading" : "initializing"
    );
    const [preloadProgress, setPreloadProgress] = useState<PreloadProgress>(
        () => createInitialProgress(preload)
    );
    const bootstrapRef = useRef<{
        controller: AbortController;
        promise: Promise<PreloadResult | null>;
    } | null>(null);
    const effectRunRef = useRef(0);
    const mountedRef = useRef(false);
    const initialOptionsRef = useRef(options);
    const initialMainMenuRef = useRef(components.MainMenu);
    const initialPreloadRef = useRef(preload);
    const initialPreloadConcurrencyRef = useRef(preloadConcurrency);
    const initialOnPreloadCompleteRef = useRef(onPreloadComplete);
    const initialShowRTGSplashScreenRef = useRef(showRTGSplashScreen);
    const initialShowSplashScreenRef = useRef(showSplashScreen);
    const initialShowSplashScreenOnDevRef = useRef(showSplashScreenOnDev);
    const initialSplashScreensRef = useRef(splashScreens);
    const appliedOptionsRef = useRef(options);

    useEffect(() => {
        mountedRef.current = true;
        const effectRun = ++effectRunRef.current;
        let active = true;

        if (!bootstrapRef.current) {
            const controller = new AbortController();
            const assets = initialPreloadRef.current;
            const gameInitialization = Game.init(initialOptionsRef.current);
            const preloading = assets.length
                ? preloadContent(assets, {
                      ...(initialPreloadConcurrencyRef.current === undefined
                          ? {}
                          : {
                                concurrency:
                                    initialPreloadConcurrencyRef.current,
                            }),
                      onProgress: (progress) => {
                          if (mountedRef.current) {
                              setPreloadProgress(progress);
                          }
                      },
                      signal: controller.signal,
                  })
                : Promise.resolve(null);

            bootstrapRef.current = {
                controller,
                promise: Promise.all([gameInitialization, preloading]).then(
                    ([, result]) => result
                ),
            };
        }

        const bootstrap = bootstrapRef.current;
        bootstrap.promise
            .then((preloadResult) => {
                if (!active) {
                    return;
                }

                if (preloadResult) {
                    initialOnPreloadCompleteRef.current?.(preloadResult);
                    if (preloadResult.failures.length) {
                        console.warn(
                            `[react-text-game] ${preloadResult.failed} preload asset(s) failed`,
                            preloadResult.failures
                        );
                    }
                }

                newWidget(
                    SYSTEM_PASSAGE_NAMES.START_MENU,
                    initialMainMenuRef.current || MainMenu
                );

                // Only set if not already set by Game.init() or registerPassage
                if (!Game.currentPassage) {
                    const initialPassage =
                        initialOptionsRef.current.startPassage ||
                        SYSTEM_PASSAGE_NAMES.START_MENU;

                    // Check if passage exists, warn if not
                    const passage = Game.getPassageById(initialPassage);
                    if (!passage && initialOptionsRef.current.startPassage) {
                        console.warn(
                            `[react-text-game] startPassage "${initialOptionsRef.current.startPassage}" not found, falling back to START_MENU`
                        );
                        Game.setCurrent(SYSTEM_PASSAGE_NAMES.START_MENU);
                    } else {
                        Game.setCurrent(initialPassage);
                    }
                }

                setIsInitialized(true);
                const hasSplashScreens =
                    initialShowRTGSplashScreenRef.current ||
                    initialSplashScreensRef.current.length > 0;
                const isDevSplashDisabled =
                    initialOptionsRef.current.isDevMode &&
                    !initialShowSplashScreenOnDevRef.current;
                setPhase(
                    initialShowSplashScreenRef.current &&
                        hasSplashScreens &&
                        !isDevSplashDisabled
                        ? "splash"
                        : "ready"
                );
            })
            .catch((error) => {
                if (!active && bootstrap.controller.signal.aborted) {
                    return;
                }
                console.error("Failed to initialize game:", error);
            });

        return () => {
            active = false;
            mountedRef.current = false;
            queueMicrotask(() => {
                if (
                    effectRunRef.current === effectRun &&
                    bootstrapRef.current === bootstrap
                ) {
                    bootstrap.controller.abort();
                }
            });
        };
    }, []);

    useEffect(() => {
        if (isInitialized && appliedOptionsRef.current !== internalOptions) {
            Game.updateOptions(internalOptions);
            appliedOptionsRef.current = internalOptions;
        }
    }, [internalOptions, isInitialized]);

    useEffect(() => {
        setInternalOptions(options);
    }, [options]);

    if (phase === "loading") {
        const LoadingScreenComponent =
            components.LoadingScreen || LoadingScreen;
        return createElement(LoadingScreenComponent, {
            ...(loadingScreen === undefined ? {} : { options: loadingScreen }),
            progress: preloadProgress,
        });
    }

    if (!isInitialized || phase === "initializing") {
        return null;
    }

    if (phase === "splash") {
        const DefaultRTGSplashScreen =
            components.RTGSplashScreen || RTGSplashScreen;
        const screens: Array<SplashScreenConfig> = [
            ...(initialShowRTGSplashScreenRef.current
                ? [
                      {
                          content: createElement(DefaultRTGSplashScreen),
                          id: "react-text-game",
                      },
                  ]
                : []),
            ...initialSplashScreensRef.current,
        ];

        return (
            <SplashScreenSequence
                onComplete={() => setPhase("ready")}
                screens={screens}
            />
        );
    }

    return (
        <ErrorBoundary>
            <ComponentsProvider components={components}>
                <SaveLoadMenuProvider>
                    {children}
                    {options.isDevMode && (
                        <>
                            <AppIconMenu
                                options={internalOptions}
                                setOptions={setInternalOptions}
                            />
                            <DevModeDrawer options={internalOptions} />
                        </>
                    )}
                    <SaveLoadModalWrapper />
                </SaveLoadMenuProvider>
            </ComponentsProvider>
        </ErrorBoundary>
    );
};
