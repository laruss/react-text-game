import { useState } from "react";

export const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
    const [showCopied, setShowCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 1000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <button
                className="ml-1 text-sm cursor-pointer text-card-foreground"
                onClick={handleCopy}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 -.5 25 25"
                    height={24}
                    width={24}
                    className="inline-block"
                >
                    <g
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    >
                        <path
                            d="M17.68 14.25a2.93 2.93 0 0 1-2.93 2.93H7.43a2.93 2.93 0 0 1-2.93-2.93V6.93A2.93 2.93 0 0 1 7.43 4h7.32a2.93 2.93 0 0 1 2.93 2.93v7.32Z"
                            clipRule="evenodd"
                        />
                        <path d="M10.25 20h7.32a2.93 2.93 0 0 0 2.93-2.93V9.75" />
                    </g>
                </svg>
            </button>
            {showCopied && (
                <span className="ml-2 text-xs text-success-600">
                    copied
                </span>
            )}
        </>
    );
};
