import type { Component, StoryOptions } from "@react-text-game/core";

/**
 * Metadata extracted from MDX frontmatter.
 * Used to configure the story during auto-registration.
 */
export interface MdxStoryMeta {
    /**
     * Required unique identifier for the story passage.
     * This will be used as the story ID in `newStory(passageId, ...)`.
     */
    passageId: string;

    /**
     * Optional story options for background, styling, etc.
     * Maps directly to `StoryOptions` from core package.
     */
    options?: StoryOptions;

    /**
     * Additional custom metadata from frontmatter.
     * Can include any user-defined properties.
     */
    [key: string]: unknown;
}

/**
 * Template structure for content with variables
 */
export interface TemplateContent {
    type: "template";
    parts: Array<
        | { type: "text"; value: string }
        | { type: "var"; expression: { type: "expression"; data?: { estree?: unknown }; value?: string } }
    >;
}

/**
 * Processed MDX structure returned by remark-mdx-struct plugin.
 */
export interface MdxStructItem {
    component: string;
    props: Record<string, unknown>;
    children: string | MdxStructItem[] | TemplateContent;
}

/**
 * Complete MDX export structure with metadata and components.
 */
export interface MdxExport {
    meta: MdxStoryMeta;
    components: MdxStructItem[];
}

/**
 * Transformation result for converting MDX to Core components.
 */
export interface TransformResult {
    components: Component[];
    errors: string[];
}
