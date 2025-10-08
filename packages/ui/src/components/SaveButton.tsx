import { twMerge } from "tailwind-merge";

import { Button, ButtonProps } from "#components/common";
import { SaveLoadMode } from "#components/GameProvider/SaveLoadMenuProvider";
import { useSaveLoadMenu } from "#hooks";

type SaveButtonProps = Omit<ButtonProps, "children" | "onClick"> &
    Readonly<{
        /**
         * If true, the button will display only the icon without any text.
         *
         * @default false
         */
        isIconOnly?: boolean;
        /**
         * Indicates the mode of operation for saving and loading functionality.
         * The `mode` property is optional and is derived from the `SaveLoadMode` type,
         * excluding the "load" property.
         *
         * @default "saveLoad"
         */
        mode?: Omit<SaveLoadMode, "load">;
    }>;

const Icon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 48 48"
        className={className}
    >
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M35.28 4.88A3 3 0 0 0 33.16 4H7a3 3 0 0 0-3 3v34a3 3 0 0 0 3 3h34a3 3 0 0 0 3-3V14.89a3 3 0 0 0-.87-2.12l-7.85-7.89ZM7 6h6v9.95c0 1.13.92 2.05 2.05 2.05h17.9c1.13 0 2.05-.92 2.05-2.05V11.2a1 1 0 1 0-2 0v4.75c0 .03-.02.05-.05.05h-17.9a.05.05 0 0 1-.05-.05V6h18.16a1 1 0 0 1 .7.3l7.85 7.88a1 1 0 0 1 .29.7V41a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm21 24.02a4 4 0 0 0-4-4 1 1 0 0 1 0-2 6 6 0 1 1-6 6 1 1 0 0 1 2 0 4 4 0 1 0 8 0Z"
            clipRule="evenodd"
        />
    </svg>
);

export const SaveButton = ({
    isIconOnly,
    className,
    mode,
    ...props
}: SaveButtonProps) => {
    const { openSaveMenu, openSaveLoadMenu } = useSaveLoadMenu();

    return (
        <Button
            className={twMerge("flex gap-2 items-center", className)}
            onClick={mode === "save" ? openSaveMenu : openSaveLoadMenu}
            {...props}
        >
            <Icon className="w-8 h-8" />
            {!isIconOnly && <span>Save Game</span>}
        </Button>
    );
};
