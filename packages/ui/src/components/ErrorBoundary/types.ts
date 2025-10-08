import { ErrorInfo, PropsWithChildren, ReactNode } from "react";

export interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    copied: boolean;
}

export interface ErrorBoundaryProps extends PropsWithChildren {
    fallback?: (
        error: Error,
        errorInfo: ErrorInfo,
        reset: () => void
    ) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
