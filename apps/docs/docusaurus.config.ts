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

    // Set the production url of your site here
    url: "https://laruss.github.io",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/react-text-game/",

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

    plugins: [
        [
            "docusaurus-plugin-typedoc",
            {
                id: "core",
                entryPoints: ["../../packages/core/src/index.ts"],
                tsconfig: "../../packages/core/tsconfig.json",
                out: "api/core",
                excludePrivate: true,
                excludeProtected: false,
                readme: "none",
            },
        ],
        [
            "docusaurus-plugin-typedoc",
            {
                id: "ui",
                entryPoints: ["../../packages/ui/src/index.ts"],
                tsconfig: "../../packages/ui/tsconfig.json",
                out: "api/ui",
                excludePrivate: true,
                excludeProtected: false,
                readme: "none",
            },
        ],
    ],

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                    routeBasePath: "/",
                    editUrl:
                        "https://github.com/laruss/react-text-game/tree/main/apps/docs/",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Options,
        ],
    ],

    themeConfig: {
        // Social card for link previews
        image: "img/logo.svg",
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
                    to: "/api/core",
                    position: "left",
                    label: "Core API",
                },
                {
                    to: "/api/ui",
                    position: "left",
                    label: "UI API",
                },
                {
                    href: "https://github.com/laruss/react-text-game",
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
                            label: "Core API",
                            to: "/api/core",
                        },
                        {
                            label: "UI API",
                            to: "/api/ui",
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
                    ],
                },
                {
                    title: "More",
                    items: [
                        {
                            label: "GitHub",
                            href: "https://github.com/laruss/react-text-game",
                        },
                        {
                            label: "Issues",
                            href: "https://github.com/laruss/react-text-game/issues",
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
