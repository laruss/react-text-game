import { serve } from "@hono/node-server";
import { ArgumentParser } from "argparse";
import { Hono } from "hono";

import passages from "#routes/passages";

const parser = new ArgumentParser({ description: "Game Observer Server" });
parser.add_argument("-p", "--port", {
    type: "int",
    help: "Port to run the server on",
    default: 3000,
});

const args = parser.parse_args();
const port: number = args.port;

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.route("/api/passages", passages);

serve(
    {
        fetch: app.fetch,
        port,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    }
);
