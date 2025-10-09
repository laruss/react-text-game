import { serve } from "bun";

import index from "./index.html";

const server = serve({
    routes: {
        "/*": index,
    },

    development: process.env.NODE_ENV !== "production" && {
        // Enable browser hot reloading in development
        hmr: true,

        // Echo console logs from the browser to the server
        console: true,
    },
    port: 3500,
});

console.log(`🚀 Server running at ${server.url}`);
