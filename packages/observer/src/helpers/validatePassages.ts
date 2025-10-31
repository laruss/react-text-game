import type {
	PassageConnection,
	PassageExtendedMetadata,
	PassagesMetadata,
	PassageSettings,
} from "#types";

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

	// Validate optional connections property
	if ("connections" in passagesData && passagesData.connections !== undefined) {
		if (!Array.isArray(passagesData.connections)) {
			throw new Error("Invalid passages data: 'connections' must be an array");
		}

		for (let i = 0; i < passagesData.connections.length; i++) {
			validateConnection(i, passagesData.connections[i]);
		}
	}

	// Validate optional settings property
	if ("settings" in passagesData && passagesData.settings !== undefined) {
		validateSettings(passagesData.settings);
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

	// Check if source exists and is valid
	if (!("source" in metadata)) {
		throw new Error(`Invalid passage metadata for '${key}': missing 'source' property`);
	}

	if (typeof metadata.source !== "string") {
		throw new Error(
			`Invalid passage metadata for '${key}': 'source' must be a string`,
		);
	}

	if (metadata.source !== "code" && metadata.source !== "tool") {
		throw new Error(
			`Invalid passage metadata for '${key}': 'source' must be either 'code' or 'tool', got '${metadata.source}'`,
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

/**
 * Validates a single connection entry
 *
 * @param index - The index in the connections array
 * @param value - The connection to validate
 * @throws Error if the connection is not valid
 */
function validateConnection(index: number, value: unknown): void {
	// Check if value is an object
	if (typeof value !== "object" || value === null) {
		throw new Error(
			`Invalid connection at index ${index}: must be an object`,
		);
	}

	const connection = value as Partial<PassageConnection>;

	// Check if from exists and is a string
	if (!("from" in connection)) {
		throw new Error(`Invalid connection at index ${index}: missing 'from' property`);
	}

	if (typeof connection.from !== "string") {
		throw new Error(
			`Invalid connection at index ${index}: 'from' must be a string`,
		);
	}

	// Check if to exists and is a string
	if (!("to" in connection)) {
		throw new Error(`Invalid connection at index ${index}: missing 'to' property`);
	}

	if (typeof connection.to !== "string") {
		throw new Error(
			`Invalid connection at index ${index}: 'to' must be a string`,
		);
	}
}

/**
 * Validates the settings object
 *
 * @param value - The settings to validate
 * @throws Error if the settings are not valid
 */
function validateSettings(value: unknown): void {
	// Check if value is an object
	if (typeof value !== "object" || value === null) {
		throw new Error("Invalid settings: must be an object");
	}

	const settings = value as Partial<PassageSettings>;

	// Check if startPassage exists and is a string
	if (!("startPassage" in settings)) {
		throw new Error("Invalid settings: missing 'startPassage' property");
	}

	if (typeof settings.startPassage !== "string") {
		throw new Error("Invalid settings: 'startPassage' must be a string");
	}
}
