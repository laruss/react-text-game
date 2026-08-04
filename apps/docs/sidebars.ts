import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    docsSidebar: [
        "intro",
        "agent-skill",
        {
            type: "category",
            label: "Start here",
            collapsed: false,
            items: [
                "getting-started",
                {
                    type: "category",
                    label: "Build your first game",
                    collapsed: false,
                    link: { type: "doc", id: "first-game/index" },
                    items: ["first-game/core+ui", "first-game/core"],
                },
            ],
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
                "mdx-integration",
                "messenger",
                "messenger-game",
                "game-clock",
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
                { type: "link", label: "Messenger", href: "/api/messenger/" },
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
