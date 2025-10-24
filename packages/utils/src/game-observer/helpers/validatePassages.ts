import type {
	PassageExtendedMetadata,
	PassagesMetadata,
} from "#game-observer/types";

/**
 * This one validates the data from passages.json passed to it.
 * If it's not valid, it throws an error.
 *
 * @param data - The data to validate
 * @returns void
 * @throws Error if the data is not valid
 */
export const validatePassages = (data: unknown): void => {
	// Check if data is an object
	if (typeof data !== "object" || data === null) {
		throw new Error("Invalid passages data: must be an object");
	}

	const passagesData = data as Partial<PassagesMetadata>;

	// Check if passages property exists
	if (!("passages" in passagesData)) {
		throw new Error("Invalid passages data: missing 'passages' property");
	}

	// Check if passages is an object
	if (
		typeof passagesData.passages !== "object" ||
		passagesData.passages === null ||
		Array.isArray(passagesData.passages)
	) {
		throw new Error("Invalid passages data: 'passages' must be an object");
	}

	// Validate each passage metadata entry
	for (const [key, value] of Object.entries(passagesData.passages)) {
		validatePassageMetadata(key, value);
	}
};

/**
 * Validates a single passage metadata entry
 *
 * @param key - The passage ID (key in the passages object)
 * @param value - The passage metadata to validate
 * @throws Error if the metadata is not valid
 */
function validatePassageMetadata(key: string, value: unknown): void {
	// Check if value is an object
	if (typeof value !== "object" || value === null) {
		throw new Error(
			`Invalid passage metadata for '${key}': must be an object`,
		);
	}

	const metadata = value as Partial<PassageExtendedMetadata>;

	// Check if id exists and matches the key
	if (!("id" in metadata)) {
		throw new Error(`Invalid passage metadata for '${key}': missing 'id' property`);
	}

	if (typeof metadata.id !== "string") {
		throw new Error(
			`Invalid passage metadata for '${key}': 'id' must be a string`,
		);
	}

	if (metadata.id !== key) {
		throw new Error(
			`Invalid passage metadata for '${key}': 'id' property ('${metadata.id}') does not match key`,
		);
	}

	// Validate optional tags property
	if ("tags" in metadata && metadata.tags !== undefined) {
		if (!Array.isArray(metadata.tags)) {
			throw new Error(
				`Invalid passage metadata for '${key}': 'tags' must be an array`,
			);
		}

		for (const tag of metadata.tags) {
			if (typeof tag !== "string") {
				throw new Error(
					`Invalid passage metadata for '${key}': all tags must be strings`,
				);
			}
		}
	}

	// Validate optional description property
	if ("description" in metadata && metadata.description !== undefined) {
		if (typeof metadata.description !== "string") {
			throw new Error(
				`Invalid passage metadata for '${key}': 'description' must be a string`,
			);
		}
	}

	// Validate optional position property
	if ("position" in metadata && metadata.position !== undefined) {
		if (typeof metadata.position !== "object" || metadata.position === null) {
			throw new Error(
				`Invalid passage metadata for '${key}': 'position' must be an object`,
			);
		}

		const position = metadata.position as Partial<{ x: number; y: number }>;

		if (!("x" in position) || typeof position.x !== "number") {
			throw new Error(
				`Invalid passage metadata for '${key}': 'position.x' must be a number`,
			);
		}

		if (!("y" in position) || typeof position.y !== "number") {
			throw new Error(
				`Invalid passage metadata for '${key}': 'position.y' must be a number`,
			);
		}
	}

	// Validate optional customMetadata property
	if ("customMetadata" in metadata && metadata.customMetadata !== undefined) {
		if (
			typeof metadata.customMetadata !== "object" ||
			metadata.customMetadata === null ||
			Array.isArray(metadata.customMetadata)
		) {
			throw new Error(
				`Invalid passage metadata for '${key}': 'customMetadata' must be an object`,
			);
		}
	}
}
