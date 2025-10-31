import { readFile, writeFile } from "node:fs/promises";

import { Hono } from "hono";

import { getGameObserverPaths } from "#paths";
import type { PassagesMetadata } from "#types";

const app = new Hono();

// get all passages, connections, etc.
app.get("/", async (c) => {
	try {
		// Get the path to passages.json
		const paths = getGameObserverPaths();

		// Read and parse the passages.json file
		const content = await readFile(paths.passages, "utf-8");
		const data: PassagesMetadata = JSON.parse(content);

		// Return the full metadata structure
		return c.json(data);
	} catch (error) {
		// If file doesn't exist, return empty structure
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return c.json({
				passages: {},
				connections: [],
				settings: { startPassage: "start-passage" },
			});
		}

		// For other errors (invalid JSON, read errors), return 500
		return c.json(
			{
				error: "Failed to read passages metadata",
				message: error instanceof Error ? error.message : String(error),
			},
			500
		);
	}
});

// Update a passage's position
app.patch("/:id/position", async (c) => {
	try {
		// Get passage ID from URL params
		const passageId = c.req.param("id");

		// Get position from request body
		const body = await c.req.json();
		const { x, y } = body;

		// Validate position data
		if (typeof x !== "number" || typeof y !== "number") {
			return c.json(
				{
					error: "Invalid position data",
					message: "Position must have numeric x and y coordinates",
				},
				400
			);
		}

		// Get the path to passages.json
		const paths = getGameObserverPaths();

		// Read and parse the passages.json file
		const content = await readFile(paths.passages, "utf-8");
		const data: PassagesMetadata = JSON.parse(content);

		// Check if passage exists
		if (!data.passages[passageId]) {
			return c.json(
				{
					error: "Passage not found",
					message: `No passage found with ID: ${passageId}`,
				},
				404
			);
		}

		// Update the passage's position
		data.passages[passageId].position = { x, y };

		// Write back to file
		await writeFile(paths.passages, JSON.stringify(data, null, 2), "utf-8");

		// Return success with updated passage
		return c.json({
			success: true,
			passage: data.passages[passageId],
		});
	} catch (error) {
		// Handle file read/write errors
		return c.json(
			{
				error: "Failed to update passage position",
				message: error instanceof Error ? error.message : String(error),
			},
			500
		);
	}
});

export default app;
