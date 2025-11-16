"use client";

import { useGameTranslation } from "@react-text-game/core/i18n";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export type LanguageToggleProps = Readonly<{
    /**
     * Optional CSS class name for custom styling
     */
    className?: string;
    /**
     * Optional namespace for translations (defaults to 'ui')
     */
    namespace?: string;
    /**
     * Optional custom language names mapping
     * Example: { en: 'English', ru: 'Русский', de: 'Deutsch' }
     */
    languageNames?: Record<string, string>;
    /**
     * Show language code alongside the name (e.g., "English (en)")
     * @default false
     */
    showCode?: boolean;
}>;

/**
 * A themed language toggle dropdown component that opens on hover.
 * Uses the UI package's semantic theming system for automatic dark mode support.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LanguageToggle />
 *
 * // With custom language names
 * <LanguageToggle
 *   languageNames={{
 *     en: 'English',
 *     ru: 'Русский',
 *     de: 'Deutsch'
 *   }}
 * />
 *
 * // With custom styling and code display
 * <LanguageToggle
 *   className="custom-class"
 *   showCode={true}
 * />
 * ```
 */
export const LanguageToggle = ({
    className = "",
    namespace,
    languageNames,
    showCode = false,
}: LanguageToggleProps) => {
    const { currentLanguage, languages, changeLanguage } =
        useGameTranslation(namespace);
    const [isOpen, setIsOpen] = useState(false);

    // Default language names - uppercase language codes
    const getLanguageName = (lang: string): string => {
        if (languageNames && languageNames[lang]) {
            return languageNames[lang];
        }
        return lang.toUpperCase();
    };

    const handleLanguageChange = async (lang: string) => {
        await changeLanguage(lang);
        setIsOpen(false);
    };

    // Don't render if there's only one language or no languages
    if (languages.length <= 1) {
        return null;
    }

    return (
        <div
            className={twMerge("relative inline-block", className)}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger Button */}
            <button
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-primary-foreground rounded-lg shadow-md transition-colors duration-200 cursor-pointer active:scale-95"
                aria-label="Select language"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {/* Globe Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                </svg>
                <span className="font-medium">
                    {getLanguageName(currentLanguage)}
                    {showCode && ` (${currentLanguage})`}
                </span>
                {/* Chevron Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={twMerge(
                        "w-4 h-4 transition-transform duration-200",
                        isOpen ? "rotate-180" : ""
                    )}
                    aria-hidden="true"
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 pt-2 min-w-full z-50"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-[fadeIn_150ms_ease-in]">
                        {languages.map((lang) => {
                            const isActive = lang === currentLanguage;
                            return (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={twMerge(
                                        "w-full text-left px-4 py-2.5 transition-colors duration-150 whitespace-nowrap",
                                        isActive
                                            ? "bg-primary-100 text-primary-700 font-medium cursor-default"
                                            : "text-popover-foreground hover:bg-muted hover:text-accent-foreground cursor-pointer"
                                    )}
                                    role="menuitem"
                                    aria-current={isActive ? "true" : undefined}
                                >
                                    {getLanguageName(lang)}
                                    {showCode && ` (${lang})`}
                                    {isActive && (
                                        <span
                                            className="ml-2"
                                            aria-label="Current language"
                                        >
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
