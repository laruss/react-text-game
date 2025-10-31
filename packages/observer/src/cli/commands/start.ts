import child_process from "node:child_process";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import program from "#cli/program";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
    .command("start")
    .description("Start the Game Observer server")
    .option(
        "-p, --port <port>",
        "Port to run the server on (defaults to 4000)",
        "4000",
    )
    .action(async (options) => {
        const port = parseInt(options.port, 10);
        if (isNaN(port)) {
            console.error("Invalid port number");
            process.exit(1);
        }
        console.log(`Starting Game Observer server on port ${port}...`);
        const serverJs = `${__dirname}/../../index.js`;
        const serverProcess = child_process.exec(`node ${serverJs} --port ${port}`);
        serverProcess.stdout?.on("data", (data) => {
            process.stdout.write(data);
        });
        serverProcess.stderr?.on("data", (data) => {
            process.stderr.write(data);
        });
    });
