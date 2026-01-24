import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
    // Documentation sidebar
    docsSidebar: [
        "intro",
        "getting-started",
        "core-concepts",
        "side-effects",
        "mdx-integration",
        "i18n",
        "migrations",
        {
            type: "html",
            value: '<a href="/demo/" target="_blank" rel="noopener noreferrer" class="menu__link">Live Demo</a>',
            defaultStyle: true,
        },
    ],
};

export default sidebars;
