import { ProcessorOptions } from "@mdx-js/mdx";
import remarkFrontmatter from "remark-frontmatter";

import recmaStoryRegister from "./recma-story-register.js";
import remarkFrontmatterToData from "./remark-frontmatter-to-data.js";
import remarkMdxStruct from "./remark-mdx-struct.js";

/**
 * MDX processor plugin for auto-registering stories on import.
 * This variant transforms MDX files into self-registering story modules.
 *
 * When a user imports an MDX file processed with this plugin,
 * the story is automatically registered with the Game engine using
 * `newStory()` with the passageId from frontmatter.
 *
 * @example
 * ```typescript
 * // In bundler config (e.g., vite.config.ts):
 * import { reactTextGameStoryPlugin } from '@react-text-game/mdx/plugin';
 *
 * export default {
 *   plugins: [
 *     mdx({
 *       ...reactTextGameStoryPlugin()
 *     })
 *   ]
 * }
 * ```
 *
 * @example
 * ```mdx
 * ---
 * passageId: intro
 * ---
 * # Welcome
 * Your adventure begins...
 * ```
 *
 * @example
 * ```typescript
 * // User imports MDX file - story auto-registers
 * import './intro.mdx'
 *
 * // Or with named import to access Story instance
 * import introStory from './intro.mdx'
 * ```
 *
 * @returns Processor options with remark and recma plugins for auto-registration
 */
export const reactTextGameStoryPlugin = (): Pick<
    ProcessorOptions,
    "recmaPlugins" | "remarkPlugins"
> => ({
    recmaPlugins: [recmaStoryRegister],
    remarkPlugins: [
        remarkFrontmatter,
        remarkFrontmatterToData,
        remarkMdxStruct,
    ],
});
