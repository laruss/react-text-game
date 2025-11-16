"use client";

import { ImageComponent } from "@react-text-game/core/passages";
import { useEffect, useId } from "react";
import { twMerge } from "tailwind-merge";

export type ImageProps = Readonly<{ component: ImageComponent }>;

export const Image = ({ component }: ImageProps) => {
    const modalId = useId();
    const shouldBeClickable =
        Boolean(component.props?.onClick) || !component.props?.disableModal;
    const disableModal = component.props?.disableModal;

    const handleClick = () => {
        if (component.props?.onClick) {
            component.props.onClick();
        }
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                const checkbox = document.getElementById(
                    modalId
                ) as HTMLInputElement;
                if (checkbox?.checked) {
                    checkbox.checked = false;
                }
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [modalId]);

    if (disableModal) {
        return (
            <img
                src={component.content}
                alt={component.props?.alt ?? "image"}
                className={twMerge(
                    "max-w-200 max-h-200 object-contain mx-auto",
                    shouldBeClickable && "cursor-pointer",
                    component.props?.className
                )}
                onClick={handleClick}
            />
        );
    }

    return (
        <>
            <input
                type="checkbox"
                id={modalId}
                className="peer/modal hidden"
                aria-hidden="true"
            />

            <label htmlFor={modalId} onClick={handleClick}>
                <img
                    src={component.content}
                    alt={component.props?.alt ?? "image"}
                    className={twMerge(
                        "max-w-200 max-h-200 object-contain mx-auto cursor-pointer",
                        component.props?.className
                    )}
                />
            </label>

            {/* Modal Overlay */}
            <div className="peer-checked/modal:opacity-100 peer-checked/modal:pointer-events-auto opacity-0 pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-overlay/80 transition-opacity duration-300 overflow-auto">
                {/* Modal Content */}
                <div className="relative w-full max-w-7xl min-h-0 p-4 m-auto flex items-center justify-center">
                    <img
                        src={component.content}
                        alt={component.props?.alt ?? "image"}
                        className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                    />

                    {/* Close Button */}
                    <label
                        htmlFor={modalId}
                        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </label>
                </div>

                {/* Click outside to close */}
                <label
                    htmlFor={modalId}
                    className="absolute inset-0 -z-10 cursor-default"
                    aria-label="Close modal"
                />
            </div>
        </>
    );
};
