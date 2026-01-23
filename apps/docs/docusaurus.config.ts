import type { Options, ThemeConfig } from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
    title: "React Text Game",
    tagline: "A powerful, reactive text-based game engine for React",
    favicon: "img/favicon.svg",

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    // Markdown configuration
    // Use "detect" to treat .md files as CommonMark and .mdx files as MDX
    // This fixes issues with TypeDoc-generated API docs containing curly braces
    markdown: {
        format: "detect",
    },

    // Set the production url of your site here
    url: "https://reacttextgame.dev",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "laruss", // Usually your GitHub org/user name.
    projectName: "react-text-game", // Usually your repo name.

    onBrokenLinks: "throw",

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    headTags: [
        // PNG favicon for better Google Search compatibility
        {
            tagName: "link",
            attributes: {
                rel: "icon",
                type: "image/png",
                sizes: "48x48",
                href: "/img/favicon-48x48.png",
            },
        },
        {
            tagName: "link",
            attributes: {
                rel: "icon",
                type: "image/png",
                sizes: "192x192",
                href: "/img/favicon-192x192.png",
            },
        },
        // Apple touch icon
        {
            tagName: "link",
            attributes: {
                rel: "apple-touch-icon",
                sizes: "192x192",
                href: "/img/favicon-192x192.png",
            },
        },
        // WebSite structured data with search functionality
        {
            tagName: "script",
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "React Text Game",
                url: "https://reacttextgame.dev/",
                potentialAction: {
                    "@type": "SearchAction",
                    target: {
                        "@type": "EntryPoint",
                        urlTemplate:
                            "https://reacttextgame.dev/?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                },
            }),
        },
        // SoftwareApplication structured data
        {
            tagName: "script",
            attributes: {
                type: "application/ld+json",
            },
            innerHTML: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "React Text Game",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web Browser",
                description:
                    "A powerful, reactive text-based game engine for React applications. Create interactive narrative experiences with support for story passages, interactive maps, and comprehensive state management.",
                url: "https://reacttextgame.dev/",
                author: {
                    "@type": "Person",
                    name: "laruss",
                    url: "https://github.com/laruss",
                },
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                programmingLanguage: ["TypeScript", "JavaScript"],
                softwareVersion: "1.0.0",
                keywords:
                    "react, text game, interactive fiction, narrative engine, game engine, typescript, valtio",
            }),
        },
    ],

    plugins: [],

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    routeBasePath: "/",
                    editUrl: "https://github.com/laruss/tree/main/apps/docs/",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
                sitemap: {
                    lastmod: "date",
                    changefreq: null,
                    priority: null,
                    ignorePatterns: ["/tags/**"],
                    filename: "sitemap.xml",
                },
            } satisfies Options,
        ],
    ],

    themeConfig: {
        // Social card for link previews
        image: "img/og-image.webp",
        // Global metadata for SEO
        metadata: [
            {
                name: "description",
                content:
                    "React Text Game is a powerful, reactive text-based game engine for creating interactive narrative experiences, visual novels, and text adventures in React. Features include story passages, interactive maps, JSONPath-based save system, and Valtio state management.",
            },
            {
                name: "keywords",
                content:
                    "react, reactjs, typescript, text game, text adventure, interactive fiction, react text game, react text adventure, react interactive fiction, narrative engine, story engine, game engine, browser game, visual novel, twine alternative, ink alternative, choicescript, passages, save system, jsonpath, valtio, tailwindcss",
            },
            { name: "author", content: "laruss" },
            { name: "twitter:card", content: "summary_large_image" },
            {
                name: "twitter:title",
                content:
                    "React Text Game - Reactive Text-Based Game Engine for React",
            },
            {
                name: "twitter:description",
                content:
                    "Build interactive narrative experiences and text adventures in React with a powerful, type-safe game engine featuring reactive state management and flexible save system.",
            },
            {
                name: "twitter:image",
                content: "https://reacttextgame.dev/img/og-image.webp",
            },
            { property: "og:type", content: "website" },
            {
                property: "og:title",
                content:
                    "React Text Game - Reactive Text-Based Game Engine for React",
            },
            {
                property: "og:description",
                content:
                    "Build interactive narrative experiences and text adventures in React with a powerful, type-safe game engine featuring reactive state management and flexible save system.",
            },
            {
                property: "og:url",
                content: "https://reacttextgame.dev/",
            },
            {
                property: "og:image",
                content: "https://reacttextgame.dev/img/og-image.webp",
            },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: "React Text Game Logo" },
            { property: "og:site_name", content: "React Text Game" },
        ],
        colorMode: {
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: "React Text Game",
            logo: {
                alt: "React Text Game Logo",
                src: "img/logo.svg",
            },
            items: [
                {
                    type: "docSidebar",
                    sidebarId: "docsSidebar",
                    position: "left",
                    label: "Docs",
                },
                {
                    to: "/api/core/",
                    position: "left",
                    label: "Core API",
                },
                {
                    to: "/api/ui/",
                    position: "left",
                    label: "UI API",
                },
                {
                    to: "/api/mdx/",
                    position: "left",
                    label: "MDX API",
                },
                {
                    href: "https://github.com/laruss",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            links: [
                {
                    title: "Documentation",
                    items: [
                        {
                            label: "Getting Started",
                            to: "/",
                        },
                        {
                            label: "Save Migrations",
                            to: "/migrations",
                        },
                        {
                            label: "Core API",
                            to: "/api/core/",
                        },
                        {
                            label: "UI API",
                            to: "/api/ui/",
                        },
                        {
                            label: "MDX API",
                            to: "/api/mdx/",
                        },
                    ],
                },
                {
                    title: "Packages",
                    items: [
                        {
                            label: "@react-text-game/core",
                            href: "https://www.npmjs.com/package/@react-text-game/core",
                        },
                        {
                            label: "@react-text-game/ui",
                            href: "https://www.npmjs.com/package/@react-text-game/ui",
                        },
                        {
                            label: "@react-text-game/mdx",
                            href: "https://www.npmjs.com/package/@react-text-game/mdx",
                        },
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/laruss",
                        },
                        {
                            label: "Issues",
                            href: "https://github.com/laruss/issues",
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} laruss. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies ThemeConfig,
};

export default config;
