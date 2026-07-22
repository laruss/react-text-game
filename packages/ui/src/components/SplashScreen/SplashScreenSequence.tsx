"use client";

import {
    type CSSProperties,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";

export const DEFAULT_SPLASH_SCREEN_DURATION = 1_500;

export type SplashScreenConfig = Readonly<{
    className?: string;
    content: ReactNode;
    duration?: number;
    id?: string;
    isInterruptible?: boolean;
    style?: CSSProperties;
}>;

export type SplashScreenSequenceProps = Readonly<{
    onComplete: () => void;
    screens: ReadonlyArray<SplashScreenConfig>;
}>;

export const SplashScreenSequence = ({
    onComplete,
    screens,
}: SplashScreenSequenceProps) => {
    const [index, setIndex] = useState(0);
    const completedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const advance = useCallback(() => {
        if (index + 1 < screens.length) {
            setIndex(index + 1);
            return;
        }
        if (!completedRef.current) {
            completedRef.current = true;
            onCompleteRef.current();
        }
    }, [index, screens.length]);

    const screen = screens[index];
    const duration = Math.max(
        0,
        screen?.duration ?? DEFAULT_SPLASH_SCREEN_DURATION
    );

    useEffect(() => {
        if (!screen) {
            if (!completedRef.current) {
                completedRef.current = true;
                onCompleteRef.current();
            }
            return;
        }

        const timeout = setTimeout(advance, duration);
        return () => clearTimeout(timeout);
    }, [advance, duration, screen]);

    if (!screen) {
        return null;
    }

    const isInterruptible = screen.isInterruptible ?? true;
    const skip = () => {
        if (isInterruptible) {
            advance();
        }
    };
    const commonProps = {
        className: twMerge(
            "rtg-splash-screen fixed inset-0 z-190 min-h-dvh w-full border-0 bg-black p-0 text-left",
            isInterruptible && "cursor-pointer",
            screen.className
        ),
        "data-rtg-splash-screen": screen.id ?? index,
        style: {
            ...screen.style,
            animationDuration: `${duration}ms`,
        },
    } as const;

    if (!isInterruptible) {
        return <div {...commonProps}>{screen.content}</div>;
    }

    return (
        <button
            {...commonProps}
            aria-label="Skip splash screen"
            onClick={skip}
            type="button"
        >
            {screen.content}
        </button>
    );
};
