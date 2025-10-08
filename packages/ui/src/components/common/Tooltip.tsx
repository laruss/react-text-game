import { ReactNode } from "react";

type Placement =
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left"
    | "right"
    | "left";

type TooltipProps = Readonly<{
    children: ReactNode;
    disabled?: boolean | undefined;
    content: ReactNode;
    className?: string | undefined;
    placement?: Placement | undefined;
}>;

const placementStyles: Record<Placement, string> = {
    "top": "bottom-full left-1/2 -translate-x-1/2 mb-2",
    "top-right": "bottom-full right-0 mb-2",
    "top-left": "bottom-full left-0 mb-2",
    "bottom": "top-full left-1/2 -translate-x-1/2 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "bottom-left": "top-full left-0 mt-2",
    "right": "left-full top-1/2 -translate-y-1/2 ml-2",
    "left": "right-full top-1/2 -translate-y-1/2 mr-2",
};

const arrowStyles: Record<Placement, string> = {
    "top": "bottom-[-4px] left-1/2 -translate-x-1/2",
    "top-right": "bottom-[-4px] right-3",
    "top-left": "bottom-[-4px] left-3",
    "bottom": "top-[-4px] left-1/2 -translate-x-1/2",
    "bottom-right": "top-[-4px] right-3",
    "bottom-left": "top-[-4px] left-3",
    "right": "left-[-4px] top-1/2 -translate-y-1/2",
    "left": "right-[-4px] top-1/2 -translate-y-1/2",
};

export const Tooltip = ({
    children,
    disabled = false,
    content,
    className = "",
    placement = "top",
}: TooltipProps) => {
    if (disabled) {
        return <>{children}</>;
    }

    return (
        <div className="group relative inline-block">
            {children}
            <div
                className={`pointer-events-none absolute z-50 px-3 py-2 text-sm font-medium text-popover-foreground bg-popover border border-border rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${placementStyles[placement]} ${className}`}
                role="tooltip"
            >
                {content}
                <div
                    className={`absolute w-2 h-2 bg-popover border-border rotate-45 ${arrowStyles[placement]}`}
                />
            </div>
        </div>
    );
};
