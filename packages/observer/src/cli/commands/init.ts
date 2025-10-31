import { initialize } from "#cli/actions/initialize";
import program from "#cli/program";

program
    .command("init")
    .description("Initialize Game Observer in the current project")
    .option("-f, --force", "Overwrite existing files")
    .option(
        "-d, --dir <path>",
        "Root directory for initialization (defaults to current directory)",
    )
    .action(async (options) => {
        console.log("Initializing Game Observer...\n");

        const result = await initialize({
            rootDir: options.dir,
            force: options.force,
        });

        if (result.success) {
            console.log(`✓ ${result.message}\n`);
            if (result.created.length > 0) {
                console.log("Created files:");
                for (const file of result.created) {
                    console.log(`  - ${file}`);
                }
            }
        } else {
            console.error(`✗ ${result.message}`);
            process.exit(1);
        }
    });
