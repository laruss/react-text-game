'use client';

import { NewOptions } from "@react-text-game/core";
import { useState } from "react";

type AppIconMenuProps = Readonly<{
    options: NewOptions;
    setOptions: (values: NewOptions) => void;
}>;

export const AppIconMenu = ({ options, setOptions }: AppIconMenuProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isDevMode } = options;

    return (
        <div className="fixed bottom-3 left-2 z-10000000">
            <button
                className="cursor-pointer hover:opacity-50 active:scale-95 bg-primary-500 p-2 rounded-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-6 h-6"
                >
                    <path
                        fill="#000"
                        fillRule="evenodd"
                        d="M2.7 13.07 8.1 5.1a.5.5 0 0 1 .9.3v11.04a.5.5 0 0 1-.75.44l-5.4-3.07a.5.5 0 0 1-.15-.73Zm14.45.73-5.4 3.07a.5.5 0 0 1-.75-.44V5.38a.5.5 0 0 1 .9-.3l5.4 8a.5.5 0 0 1-.15.72ZM11 .53c-.48-.7-1.52-.7-2 0L.24 13.03c-.43.58-.26 1.4.36 1.77L9 19.63l.42.22c.36.2.8.2 1.16 0l.42-.22 8.4-4.83c.62-.36.8-1.19.36-1.77L11 .53Z"
                    />
                </svg>
            </button>
            {isHovered && (
                <div
                    className="absolute left-full bottom-0 bg-popover border border-border rounded-lg shadow-lg p-3 whitespace-nowrap"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <label className="flex items-center gap-2 cursor-pointer text-popover-foreground">
                        <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={!!isDevMode}
                            onChange={() =>
                                setOptions({
                                    ...options,
                                    isDevMode: !isDevMode,
                                })
                            }
                        />
                        <span>Is dev mode</span>
                    </label>
                </div>
            )}
        </div>
    );
};
