import { ButtonColor, ButtonVariant } from "@react-text-game/core";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    Readonly<{
        variant?: ButtonVariant | undefined;
        color?: ButtonColor | undefined;
    }>;

const variantColorStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
    solid: {
        default: "bg-muted-500 text-primary-foreground hover:bg-muted-600",
        primary: "bg-primary-500 text-primary-foreground hover:bg-primary-600",
        secondary:
            "bg-secondary-500 text-secondary-foreground hover:bg-secondary-600",
        success: "bg-success-500 text-success-foreground hover:bg-success-600",
        warning: "bg-warning-500 text-warning-foreground hover:bg-warning-600",
        danger: "bg-danger-500 text-danger-foreground hover:bg-danger-600",
    },
    faded: {
        default: "bg-muted-100 text-muted-700 hover:bg-muted-200",
        primary: "bg-primary-100 text-primary-700 hover:bg-primary-200",
        secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200",
        success: "bg-success-100 text-success-700 hover:bg-success-200",
        warning: "bg-warning-100 text-warning-700 hover:bg-warning-200",
        danger: "bg-danger-100 text-danger-700 hover:bg-danger-200",
    },
    bordered: {
        default: "border-2 border-muted-500 text-muted-700 hover:bg-muted-50",
        primary:
            "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
        secondary:
            "border-2 border-secondary-500 text-secondary-600 hover:bg-secondary-50",
        success:
            "border-2 border-success-500 text-success-600 hover:bg-success-50",
        warning:
            "border-2 border-warning-500 text-warning-600 hover:bg-warning-50",
        danger: "border-2 border-danger-500 text-danger-600 hover:bg-danger-50",
    },
    light: {
        default: "bg-transparent text-muted-700 hover:bg-muted-100",
        primary: "bg-transparent text-primary-600 hover:bg-primary-50",
        secondary: "bg-transparent text-secondary-600 hover:bg-secondary-50",
        success: "bg-transparent text-success-600 hover:bg-success-50",
        warning: "bg-transparent text-warning-600 hover:bg-warning-50",
        danger: "bg-transparent text-danger-600 hover:bg-danger-50",
    },
    flat: {
        default: "bg-muted-200 text-muted-700 hover:bg-muted-300",
        primary: "bg-primary-200 text-primary-800 hover:bg-primary-300",
        secondary: "bg-secondary-200 text-secondary-800 hover:bg-secondary-300",
        success: "bg-success-200 text-success-800 hover:bg-success-300",
        warning: "bg-warning-200 text-warning-800 hover:bg-warning-300",
        danger: "bg-danger-200 text-danger-800 hover:bg-danger-300",
    },
    ghost: {
        default: "text-muted-700 hover:bg-muted-100",
        primary: "text-primary-600 hover:bg-primary-50",
        secondary: "text-secondary-600 hover:bg-secondary-50",
        success: "text-success-600 hover:bg-success-50",
        warning: "text-warning-600 hover:bg-warning-50",
        danger: "text-danger-600 hover:bg-danger-50",
    },
    shadow: {
        default:
            "bg-muted-500 text-primary-foreground shadow-lg shadow-muted-500/50 hover:bg-muted-600",
        primary:
            "bg-primary-500 text-primary-foreground shadow-lg shadow-primary-500/50 hover:bg-primary-600",
        secondary:
            "bg-secondary-500 text-secondary-foreground shadow-lg shadow-secondary-500/50 hover:bg-secondary-600",
        success:
            "bg-success-500 text-success-foreground shadow-lg shadow-success-500/50 hover:bg-success-600",
        warning:
            "bg-warning-500 text-warning-foreground shadow-lg shadow-warning-500/50 hover:bg-warning-600",
        danger: "bg-danger-500 text-danger-foreground shadow-lg shadow-danger-500/50 hover:bg-danger-600",
    },
};

export const Button = ({
    className,
    variant = "solid",
    color = "primary",
    ...props
}: ButtonProps) => {
    return (
        <button
            className={twMerge(
                "px-4 py-2 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                variantColorStyles[variant][color],
                className
            )}
            {...props}
        />
    );
};
