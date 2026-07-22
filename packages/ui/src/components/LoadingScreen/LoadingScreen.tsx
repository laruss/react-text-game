"use client";

import type { PreloadProgress } from "@react-text-game/core";
import {
    type CSSProperties,
    type HTMLAttributes,
    useEffect,
    useMemo,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";

import { RTGLogo } from "#components/Brand";

export type LoadingScreenOptions = Readonly<{
    backgroundImage?: string;
    className?: string;
    logoClassName?: string;
    progressBarClassName?: string;
    progressBarStyle?: CSSProperties;
    progressTrackClassName?: string;
    progressTrackStyle?: CSSProperties;
    style?: CSSProperties;
    text?: string | ReadonlyArray<string>;
    textClassName?: string;
    textInterval?: number;
}>;

export type LoadingScreenProps = Readonly<{
    options?: LoadingScreenOptions;
    progress: PreloadProgress;
}>;

const DEFAULT_TEXT = "loading...";
const DEFAULT_TEXT_INTERVAL = 2_000;

const getTexts = (
    text: LoadingScreenOptions["text"]
): ReadonlyArray<string> => {
    if (typeof text === "string") {
        return text ? [text] : [DEFAULT_TEXT];
    }

    const texts = text?.filter(Boolean);
    return texts?.length ? texts : [DEFAULT_TEXT];
};

export const LoadingScreen = ({
    options = {},
    progress,
}: LoadingScreenProps) => {
    const texts = useMemo(() => getTexts(options.text), [options.text]);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        setTextIndex(0);
        if (texts.length < 2) {
            return;
        }

        const interval = setInterval(
            () => setTextIndex((index) => (index + 1) % texts.length),
            Math.max(1, options.textInterval ?? DEFAULT_TEXT_INTERVAL)
        );
        return () => clearInterval(interval);
    }, [options.textInterval, texts]);

    const percentage = Math.round(
        Math.min(1, Math.max(0, progress.progress)) * 100
    );
    const backgroundStyle: CSSProperties = {
        ...options.style,
        ...(options.backgroundImage
            ? {
                  backgroundImage: `url("${options.backgroundImage.replaceAll('"', '\\"')}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
              }
            : {}),
    };
    const progressAttributes: HTMLAttributes<HTMLDivElement> = {
        "aria-label": texts[textIndex] ?? DEFAULT_TEXT,
        "aria-valuemax": 100,
        "aria-valuemin": 0,
        "aria-valuenow": percentage,
        role: "progressbar",
    };

    return (
        <div
            className={twMerge(
                "fixed inset-0 z-200 flex min-h-dvh w-full flex-col items-center justify-center gap-8 bg-background bg-no-repeat p-6 text-foreground",
                options.className
            )}
            data-rtg-loading-screen=""
            style={backgroundStyle}
        >
            <RTGLogo
                className={twMerge("h-20 w-20", options.logoClassName)}
                title="React Text Game"
            />
            <div className="flex w-full max-w-md flex-col gap-3">
                <div
                    className={twMerge(
                        "h-2 w-full overflow-hidden rounded-full bg-muted-200",
                        options.progressTrackClassName
                    )}
                    style={options.progressTrackStyle}
                    {...progressAttributes}
                >
                    <div
                        className={twMerge(
                            "h-full rounded-full bg-primary-500 transition-[width] duration-200 ease-out",
                            options.progressBarClassName
                        )}
                        data-rtg-loading-progress=""
                        style={{
                            ...options.progressBarStyle,
                            width: `${percentage}%`,
                        }}
                    />
                </div>
                <p
                    aria-live="polite"
                    className={twMerge(
                        "rtg-loading-text text-center text-sm tracking-widest text-muted-600",
                        options.textClassName
                    )}
                    key={textIndex}
                    role="status"
                >
                    {texts[textIndex] ?? DEFAULT_TEXT}
                </p>
            </div>
        </div>
    );
};
