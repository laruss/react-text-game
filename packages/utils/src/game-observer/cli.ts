#!/usr/bin/env node
import { Command } from "commander";

import { initialize } from "./actions/initialize";
import { scanPassages } from "./actions/scanPassages";
import { checkIsInitialized } from "./actions/utils";

const program = new Command();

program
	.name("game-observer")
	.description("CLI for Game Observer utilities")
	.version("1.0.0");

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

program.parse(process.argv);
