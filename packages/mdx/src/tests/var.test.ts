import { compile } from "@mdx-js/mdx";
import { describe, expect, test } from "bun:test";

import { reactTextGameStoryPlugin } from "../plugins";

describe("Var component", () => {
    test("should convert Var to template literal in paragraph", async () => {
        const mdxSource = `---
passageId: test
---
import { Var } from "@react-text-game/mdx";

Player name is <Var>{player.name}</Var>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that it contains a template literal
        expect(code).toContain("`");
        expect(code).toContain("player.name");
        expect(code).toContain("Player name is ${player.name}");
    });

    test("should convert Var to template literal inside JSX <p> element", async () => {
        const mdxSource = `---
passageId: test
---
import { Var } from "@react-text-game/mdx";

<p>
    Player name is <Var>{player.name}</Var>
</p>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that it contains a template literal
        expect(code).toContain("`");
        expect(code).toContain("player.name");
        expect(code).toContain("Player name is ${player.name}");
    });

    test("should convert Var to template literal in Say component", async () => {
        const mdxSource = `---
passageId: test
---
import { Var, Conversation, Say } from "@react-text-game/mdx";

<Conversation>
    <Say>What are you doing, <Var>{player.name}</Var>?</Say>
</Conversation>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that it contains a template literal
        expect(code).toContain("`");
        expect(code).toContain("player.name");
        expect(code).toContain("What are you doing, ${player.name}?");
    });

    test("should convert Var to template literal in Action label", async () => {
        const mdxSource = `---
passageId: test
---
import { Var, Actions, Action } from "@react-text-game/mdx";

<Actions>
    <Action onPerform={() => console.log("test")}>
        Talk to <Var>{player.name}</Var>
    </Action>
</Actions>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that it contains a template literal
        expect(code).toContain("`");
        expect(code).toContain("player.name");
        expect(code).toContain("Talk to ${player.name}");
    });

    test("should convert bare expressions to template literals in Say component", async () => {
        const mdxSource = `---
passageId: test
---
import { Conversation, Say } from "@react-text-game/mdx";

<Conversation>
    <Say>What are you doing, {player.name}?</Say>
</Conversation>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that it contains a template literal
        expect(code).toContain("`");
        expect(code).toContain("player.name");
        expect(code).toContain("What are you doing, ${player.name}?");
    });

    test("should handle multiple variables in one line", async () => {
        const mdxSource = `---
passageId: test
---
import { player, game } from "@/entities";

You have {player.gold} gold and {player.health}/{player.maxHealth} HP. Level: {game.difficulty}.
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check that all variables are in template literal
        expect(code).toContain("`");
        expect(code).toContain("${player.gold}");
        expect(code).toContain("${player.health}");
        expect(code).toContain("${player.maxHealth}");
        expect(code).toContain("${game.difficulty}");
    });

    test("should handle variables at start and end of text", async () => {
        const mdxSource = `---
passageId: test
---
import { player } from "@/entities";

{player.name} is a warrior of level {player.level}
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Should start with template literal, not plain string
        expect(code).toContain(
            "`${player.name} is a warrior of level ${player.level}`"
        );
    });

    test("should handle complex nested expressions", async () => {
        const mdxSource = `---
passageId: test
---
import { player } from "@/entities";

<Conversation>
    <Say>You have {player.inventory.filter(i => i.type === 'weapon').length} weapons!</Say>
    <Say>Status: {player.health > 50 ? "Healthy" : "Wounded"}</Say>
</Conversation>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check complex expressions are preserved
        expect(code).toContain("player.inventory.filter");
        expect(code).toContain("player.health > 50");
        expect(code).toContain('"Healthy"');
        expect(code).toContain('"Wounded"');
    });

    test("should handle mix of bare expressions and Var wrapper", async () => {
        const mdxSource = `---
passageId: test
---
import { Var } from "@react-text-game/mdx";
import { player } from "@/entities";

Hello {player.name}, you have <Var>{player.gold}</Var> gold coins.
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Both should be in the same template literal
        expect(code).toContain("`");
        expect(code).toContain("${player.name}");
        expect(code).toContain("${player.gold}");
        expect(code).toContain(
            "Hello ${player.name}, you have ${player.gold} gold coins"
        );
    });

    test("should handle variables in multiple component types simultaneously", async () => {
        const mdxSource = `---
passageId: test
---
import { Actions, Action, Conversation, Say } from "@react-text-game/mdx";
import { player, npc } from "@/entities";

# Chapter: {player.currentChapter}

You meet {npc.name}.

<Conversation>
    <Say>{npc.greeting}, {player.name}!</Say>
    <Say side="right">Hello {npc.name}, I have {player.questItems.length} quest items.</Say>
</Conversation>

<Actions>
    <Action onPerform={() => console.log("test")}>
        Trade with {npc.name} ({npc.reputation} reputation)
    </Action>
</Actions>
`;

        const result = await compile(mdxSource, {
            ...reactTextGameStoryPlugin(),
        });

        const code = String(result);

        // Check header
        expect(code).toContain("Chapter: ${player.currentChapter}");

        // Check paragraph
        expect(code).toContain("You meet ${npc.name}");

        // Check Say components
        expect(code).toContain("${npc.greeting}, ${player.name}!");
        expect(code).toContain(
            "Hello ${npc.name}, I have ${player.questItems.length} quest items"
        );

        // Check Action label
        expect(code).toContain(
            "Trade with ${npc.name} (${npc.reputation} reputation)"
        );
    });
});
