import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    docsSidebar: [
        "intro",
        {
            type: "category",
            label: "Start here",
            collapsed: false,
            items: ["getting-started", "first-game"],
        },
        {
            type: "category",
            label: "Core concepts",
            items: ["core-concepts", "side-effects"],
        },
        {
            type: "category",
            label: "Guides",
            items: [
                "interactive-maps",
                "loading-and-splash-screens",
                "agent-skill",
                "mdx-integration",
                "i18n",
                "migrations",
            ],
        },
        {
            type: "category",
            label: "Customize",
            items: ["custom-ui"],
        },
        {
            type: "category",
            label: "API reference",
            items: [
                { type: "link", label: "Core", href: "/api/core/" },
                { type: "link", label: "UI", href: "/api/ui/" },
                { type: "link", label: "MDX", href: "/api/mdx/" },
            ],
        },
        {
            type: "html",
            value: '<a href="/demo/" target="_blank" rel="noopener noreferrer" class="menu__link">Live Demo</a>',
            defaultStyle: true,
        },
    ],
};

export default sidebars;
