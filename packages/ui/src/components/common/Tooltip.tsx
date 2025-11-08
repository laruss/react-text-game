"use client";

import { ReactNode, RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type Placement =
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left"
    | "right"
    | "left";

export type TooltipProps = Readonly<{
    targetRef: RefObject<HTMLElement | HTMLDivElement | HTMLButtonElement | null>;
    disabled?: boolean | undefined;
    content: ReactNode;
    className?: string | undefined;
    placement?: Placement | undefined;
}>;

const ARROW_SIZE = 4;
const TOOLTIP_OFFSET = 8;

const getArrowRotation = (placement: Placement): string => {
    if (placement.startsWith("top")) return "rotate-45";
    if (placement.startsWith("bottom")) return "rotate-45";
    if (placement === "right") return "rotate-45";
    if (placement === "left") return "rotate-45";
    return "rotate-45";
};

const calculatePosition = (
    targetRect: DOMRect,
    tooltipRect: DOMRect,
    placement: Placement
): { top: number; left: number; arrowTop: number; arrowLeft: number } => {
    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    switch (placement) {
        case "top":
            top = targetRect.top - tooltipRect.height - TOOLTIP_OFFSET;
            left = targetCenterX - tooltipRect.width / 2;
            arrowTop = tooltipRect.height - ARROW_SIZE;
            arrowLeft = tooltipRect.width / 2 - ARROW_SIZE;
            break;
        case "top-right":
            top = targetRect.top - tooltipRect.height - TOOLTIP_OFFSET;
            left = targetRect.right - tooltipRect.width;
            arrowTop = tooltipRect.height - ARROW_SIZE;
            arrowLeft = tooltipRect.width - 16;
            break;
        case "top-left":
            top = targetRect.top - tooltipRect.height - TOOLTIP_OFFSET;
            left = targetRect.left;
            arrowTop = tooltipRect.height - ARROW_SIZE;
            arrowLeft = 12;
            break;
        case "bottom":
            top = targetRect.bottom + TOOLTIP_OFFSET;
            left = targetCenterX - tooltipRect.width / 2;
            arrowTop = -ARROW_SIZE;
            arrowLeft = tooltipRect.width / 2 - ARROW_SIZE;
            break;
        case "bottom-right":
            top = targetRect.bottom + TOOLTIP_OFFSET;
            left = targetRect.right - tooltipRect.width;
            arrowTop = -ARROW_SIZE;
            arrowLeft = tooltipRect.width - 16;
            break;
        case "bottom-left":
            top = targetRect.bottom + TOOLTIP_OFFSET;
            left = targetRect.left;
            arrowTop = -ARROW_SIZE;
            arrowLeft = 12;
            break;
        case "right":
            top = targetCenterY - tooltipRect.height / 2;
            left = targetRect.right + TOOLTIP_OFFSET;
            arrowTop = tooltipRect.height / 2 - ARROW_SIZE;
            arrowLeft = -ARROW_SIZE;
            break;
        case "left":
            top = targetCenterY - tooltipRect.height / 2;
            left = targetRect.left - tooltipRect.width - TOOLTIP_OFFSET;
            arrowTop = tooltipRect.height / 2 - ARROW_SIZE;
            arrowLeft = tooltipRect.width - ARROW_SIZE;
            break;
    }

    return { top, left, arrowTop, arrowLeft };
};

export const Tooltip = ({
    targetRef,
    disabled = false,
    content,
    className = "",
    placement = "top",
}: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
    const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
        null
    );

    useEffect(() => {
        const target = targetRef.current;
        if (!target || disabled) return;

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        target.addEventListener("mouseenter", handleMouseEnter);
        target.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            target.removeEventListener("mouseenter", handleMouseEnter);
            target.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [targetRef, disabled]);

    useEffect(() => {
        if (!isVisible || !tooltipElement || !targetRef.current) return;

        const updatePosition = () => {
            const targetRect = targetRef.current!.getBoundingClientRect();
            const tooltipRect = tooltipElement.getBoundingClientRect();

            const { top, left, arrowTop, arrowLeft } = calculatePosition(
                targetRect,
                tooltipRect,
                placement
            );

            setPosition({ top, left });
            setArrowPosition({ top: arrowTop, left: arrowLeft });
        };

        updatePosition();

        // Update position on scroll or resize
        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isVisible, tooltipElement, targetRef, placement]);

    if (disabled || !isVisible) {
        return null;
    }

    return createPortal(
        <div
            ref={setTooltipElement}
            className={`fixed z-50 px-3 py-2 text-sm font-medium text-popover-foreground bg-popover border border-border rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
            } ${className}`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            role="tooltip"
            {...{ "data-testid": "tooltip-content" }}
        >
            {content}
            <div
                className={`absolute w-2 h-2 bg-popover border-border ${getArrowRotation(placement)}`}
                style={{
                    top: `${arrowPosition.top}px`,
                    left: `${arrowPosition.left}px`,
                }}
            />
        </div>,
        document.body
    );
};
