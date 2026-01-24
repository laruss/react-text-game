import mdx from "@mdx-js/rollup";
import { reactTextGameStoryPlugin } from "@react-text-game/mdx/plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        {
            enforce: "pre",
            ...mdx({ ...reactTextGameStoryPlugin() }),
        },
        react(),
        tailwindcss(),
    ],
    // Use /demo/ base path when building for docs deployment
    base: process.env.DOCS_BUILD ? "/demo/" : "./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
