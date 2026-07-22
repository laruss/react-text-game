import { describe, expect, test } from "bun:test";
import { compile } from "@mdx-js/mdx";

import legacyMdxStoryPlugin from "#plugin";
import * as pluginEntry from "#plugins";

describe("plugin entries", () => {
    test("the public plugin entry exposes a complete MDX processor setup", () => {
        expect(Object.keys(pluginEntry)).toEqual(["reactTextGameStoryPlugin"]);

        const options = pluginEntry.reactTextGameStoryPlugin();
        const remarkPlugins = options.remarkPlugins ?? [];
        const recmaPlugins = options.recmaPlugins ?? [];

        expect(remarkPlugins).toHaveLength(3);
        expect(recmaPlugins).toHaveLength(1);
        for (const plugin of [...remarkPlugins, ...recmaPlugins]) {
            expect(typeof plugin).toBe("function");
        }
    });

    test("the exported processor setup compiles a self-registering story", async () => {
        const result = await compile(
            `---\npassageId: public-entry\n---\n# Public entry`,
            pluginEntry.reactTextGameStoryPlugin()
        );

        expect(result.value).toContain('newStory("public-entry"');
        expect(result.value).toContain('content: "Public entry"');
        expect(result.value).toContain("export default story");
    });

    test("the legacy plugin module remains a no-op", () => {
        expect(legacyMdxStoryPlugin()).toBeUndefined();
    });
});
