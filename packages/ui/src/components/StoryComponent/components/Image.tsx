"use client";

import type { ImageComponent } from "@react-text-game/core/passages";
import {
    type KeyboardEvent as ReactKeyboardEvent,
    useEffect,
    useId,
} from "react";
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

    const handleKeyDown = (event: ReactKeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        handleClick();
    };

    const openModal = () => {
        handleClick();
        const checkbox = document.getElementById(
            modalId
        ) as HTMLInputElement | null;
        if (checkbox) checkbox.checked = true;
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
                id="image-content"
                src={component.content}
                alt={component.props?.alt ?? "image"}
                className={twMerge(
                    "max-w-200 max-h-200 object-contain mx-auto",
                    shouldBeClickable && "cursor-pointer",
                    component.props?.className
                )}
                onClick={component.props?.onClick ? handleClick : undefined}
                onKeyDown={component.props?.onClick ? handleKeyDown : undefined}
                role={component.props?.onClick ? "button" : undefined}
                tabIndex={component.props?.onClick ? 0 : undefined}
            />
        );
    }

    return (
        <>
            <input type="checkbox" id={modalId} className="peer/modal hidden" />

            <button
                type="button"
                onClick={openModal}
                className="block border-0 bg-transparent p-0"
            >
                <img
                    id="image-content-modal"
                    src={component.content}
                    alt={component.props?.alt ?? "image"}
                    className={twMerge(
                        "max-w-200 max-h-200 object-contain mx-auto cursor-pointer",
                        component.props?.className
                    )}
                />
            </button>

            {/* Modal Overlay */}
            <div
                id="image-content-modal-overlay"
                className="peer-checked/modal:opacity-100 peer-checked/modal:pointer-events-auto opacity-0 pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center bg-overlay/80 transition-opacity duration-300 overflow-auto"
            >
                {/* Modal Content */}
                <div
                    id="image-content-modal-content"
                    className="relative w-full max-w-7xl min-h-0 p-4 m-auto flex items-center justify-center"
                >
                    <img
                        id="image-content-modal-image"
                        src={component.content}
                        alt={component.props?.alt ?? "image"}
                        className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
                    />

                    {/* Close Button */}
                    <label
                        id="image-content-modal-close-button"
                        htmlFor={modalId}
                        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
                        aria-label="Close modal"
                    >
                        <svg
                            aria-hidden="true"
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
