import { scanPassages } from "#cli/actions/scanPassages";
import { checkIsInitialized } from "#cli/actions/utils";
import program from "#cli/program";

program
    .command("scan")
    .description("Scan project for passages and update metadata")
    .option(
        "-d, --dir <path>",
        "Root directory to scan (defaults to current directory)",
    )
    .action(async (options) => {
        try {
            // Check if Game Observer is initialized before scanning
            checkIsInitialized(options.dir);
        } catch (error) {
            console.error(
                `✗ ${error instanceof Error ? error.message : String(error)}`,
            );
            process.exit(1);
        }

        console.log("Scanning project for passages...\n");

        const result = await scanPassages({
            rootDir: options.dir,
        });

        if (result.success) {
            console.log(`✓ ${result.message}\n`);
            console.log(`Found: ${result.found} passages`);
            console.log(`Added: ${result.added} new passages`);
            console.log(`Updated: ${result.updated} existing passages`);
            console.log(`Removed: ${result.removed} deleted passages`);

            if (result.errors.length > 0) {
                console.log(`\nWarnings (${result.errors.length}):`);
                for (const error of result.errors) {
                    console.log(`  ${error}`);
                }
            }
        } else {
            console.error(`✗ ${result.message}`);
            if (result.errors.length > 0) {
                console.error("\nErrors:");
                for (const error of result.errors) {
                    console.error(`  ${error}`);
                }
            }
            process.exit(1);
        }
    });
