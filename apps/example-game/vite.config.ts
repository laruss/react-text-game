import mdx from "@mdx-js/rollup";
import { reactTextGamePlugin } from "@react-text-game/mdx/plgugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        {
            enforce: "pre",
            ...mdx({ ...reactTextGamePlugin() }),
        },
        react(),
        tailwindcss(),
    ],
    base: "./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
