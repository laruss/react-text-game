import { useRestartGame } from "@react-text-game/core/saves";
import { twMerge } from "tailwind-merge";

import { Button, ButtonProps } from "#components/common";

export type ReloadButtonProps = Omit<ButtonProps, "children" | "onClick"> &
    Readonly<{
        /**
         * If true, the button will display only the icon without any text.
         *
         * @default false
         */
        isIconOnly?: boolean;
    }>;

export const Icon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className={className}
    >
        <g stroke="currentColor" strokeLinecap="round" strokeWidth="1.5">
            <path
                strokeLinejoin="round"
                d="m15.98 8.71-.44-.45c-1.96-2-5.12-2-7.08 0a5.2 5.2 0 0 0 0 7.24c1.96 2 5.12 2 7.08 0a5.18 5.18 0 0 0 1.42-4.26m-.98-2.53h-2.65m2.65 0V6"
            />
            <path d="M22 12c0 4.71 0 7.07-1.46 8.54C19.07 22 16.7 22 12 22c-4.71 0-7.07 0-8.54-1.46C2 19.07 2 16.7 2 12c0-4.71 0-7.07 1.46-8.54C4.93 2 7.3 2 12 2c4.71 0 7.07 0 8.54 1.46.97.98 1.3 2.35 1.4 4.54" />
        </g>
    </svg>
);

export const ReloadButton = ({
    isIconOnly,
    className,
    ...props
}: ReloadButtonProps) => {
    const reload = useRestartGame();

    return (
        <Button
            className={twMerge("flex gap-2 items-center", className)}
            onClick={reload}
            {...props}
        >
            <Icon className="w-8 h-8" />
            {!isIconOnly && <span>Restart Game</span>}
        </Button>
    );
};
