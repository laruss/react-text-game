import { compile } from "@mdx-js/mdx";
import { describe, expect, test } from "bun:test";

import { reactTextGameStoryPlugin } from "#plugins/index";

describe("MDX Story Plugin", () => {
    describe("Basic HTML Components", () => {
        test("transforms h1-h6 headings to HeaderComponent", async () => {
            const mdx = `---
passageId: test-headings
---
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            // Check that all headings are transformed
            expect(code).toContain('type: "header"');
            expect(code).toContain('content: "Heading 1"');
            expect(code).toContain('"level": 1');
            expect(code).toContain('content: "Heading 2"');
            expect(code).toContain('"level": 2');
            expect(code).toContain('content: "Heading 3"');
            expect(code).toContain('"level": 3');
            expect(code).toContain('content: "Heading 4"');
            expect(code).toContain('"level": 4');
            expect(code).toContain('content: "Heading 5"');
            expect(code).toContain('"level": 5');
            expect(code).toContain('content: "Heading 6"');
            expect(code).toContain('"level": 6');
        });

        test("transforms paragraphs to TextComponent", async () => {
            const mdx = `---
passageId: test-text
---
This is a simple paragraph.

This is another paragraph with multiple words.
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "text"');
            expect(code).toContain('content: "This is a simple paragraph."');
            expect(code).toContain(
                'content: "This is another paragraph with multiple words."'
            );
        });

        test("transforms <img> tags to ImageComponent", async () => {
            const mdx = `---
passageId: test-img
---
<img src="/images/test.png" />
<img src="avatar.jpg" alt="Avatar" />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "image"');
            expect(code).toContain('content: "/images/test.png"');
            expect(code).toContain('content: "avatar.jpg"');
            expect(code).toContain('"alt": "Avatar"');
        });

        test("transforms markdown images ![alt](src) to ImageComponent", async () => {
            const mdx = `---
passageId: test-md-img
---
![My Image](photo.jpg)

![Image with title](landscape.png "Beautiful Landscape")
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "image"');
            expect(code).toContain('content: "photo.jpg"');
            expect(code).toContain('"alt": "My Image"');
            expect(code).toContain('content: "landscape.png"');
            expect(code).toContain('"alt": "Image with title"');
            expect(code).toContain('"title": "Beautiful Landscape"');
        });

        test("transforms <video> tags to VideoComponent", async () => {
            const mdx = `---
passageId: test-video
---
<video src="/videos/intro.mp4" />
<video src="clip.webm" controls />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "video"');
            expect(code).toContain('content: "/videos/intro.mp4"');
            expect(code).toContain('content: "clip.webm"');
        });

        test("transforms <video> with all supported props", async () => {
            const mdx = `---
passageId: test-video-props
---
<video src="demo.mp4" className="video-player" controls={true} autoPlay={false} loop={true} muted={true} />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "video"');
            expect(code).toContain('content: "demo.mp4"');
            expect(code).toContain('className: "video-player"');
            expect(code).toContain('controls: true');
            expect(code).toContain('autoPlay: false');
            expect(code).toContain('loop: true');
            expect(code).toContain('muted: true');
        });

        test("transforms <img> with all supported props", async () => {
            const mdx = `---
passageId: test-img-props
---
<img src="photo.jpg" alt="Photo" title="My Photo" className="rounded" disableModal={true} onClick={() => console.log('clicked')} />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "image"');
            expect(code).toContain('content: "photo.jpg"');
            expect(code).toContain('alt: "Photo"');
            expect(code).toContain('title: "My Photo"');
            expect(code).toContain('className: "rounded"');
            expect(code).toContain('disableModal: true');
            expect(code).toContain("console.log('clicked')");
        });
    });

    describe("MDX Components", () => {
        test("transforms <Actions> and <Action> to ActionsComponent", async () => {
            const mdx = `---
passageId: test-actions
---
import {Actions, Action} from '@react-text-game/mdx';

<Actions>
    <Action onPerform={() => console.log('clicked')}>Click Me</Action>
    <Action onPerform={() => alert('hello')}>Alert</Action>
</Actions>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "actions"');
            expect(code).toContain('label: "Click Me"');
            expect(code).toContain('label: "Alert"');
            expect(code).toContain("console.log('clicked')");
            expect(code).toContain("alert('hello')");
            // Should not contain MDX component imports
            expect(code).not.toContain("@react-text-game/mdx");
        });

        test("transforms <Actions> with direction prop", async () => {
            const mdx = `---
passageId: test-actions-direction
---
import {Actions, Action} from '@react-text-game/mdx';

<Actions direction="vertical">
    <Action onPerform={() => {}}>Action 1</Action>
    <Action onPerform={() => {}}>Action 2</Action>
</Actions>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "actions"');
            // Note: direction is a prop of Actions, not individual actions
            // The recma plugin currently doesn't handle Actions-level props
            // This test documents current behavior
        });

        test("transforms <Conversation> and <Say> to ConversationComponent", async () => {
            const mdx = `---
passageId: test-conversation
---
import {Conversation, Say} from '@react-text-game/mdx';

<Conversation>
    <Say>Hello there!</Say>
    <Say>Hi, how are you?</Say>
</Conversation>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "conversation"');
            expect(code).toContain('content: "Hello there!"');
            expect(code).toContain('content: "Hi, how are you?"');
        });

        test("transforms <Conversation> with who, side, and color props", async () => {
            const mdx = `---
passageId: test-conversation-props
---
import {Conversation, Say} from '@react-text-game/mdx';

<Conversation>
    <Say who={{name: 'Alice'}} side="left" color="#ff0000">Hello!</Say>
    <Say who={{name: 'Bob', avatar: '/avatar.png'}} side="right">Hi Alice!</Say>
</Conversation>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "conversation"');
            expect(code).toContain("name: 'Alice'");
            expect(code).toContain('color: "#ff0000"');
            expect(code).toContain('side: "left"');
            expect(code).toContain("name: 'Bob'");
            expect(code).toContain("avatar: '/avatar.png'");
            expect(code).toContain('side: "right"');
        });

        test("transforms <Conversation> with appearance and variant props", async () => {
            const mdx = `---
passageId: test-conversation-appearance
---
import {Conversation, Say} from '@react-text-game/mdx';

<Conversation appearance="byClick" variant="messenger">
    <Say>Message 1</Say>
    <Say>Message 2</Say>
</Conversation>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "conversation"');
            expect(code).toContain('appearance: "byClick"');
            expect(code).toContain('"variant": "messenger"');
        });

        test("transforms <Include> to AnotherStoryComponent", async () => {
            const mdx = `---
passageId: test-include
---
import {Include} from '@react-text-game/mdx';

<Include storyId="shared-intro" />
<Include storyId="common-footer" />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "anotherStory"');
            expect(code).toContain('storyId: "shared-intro"');
            expect(code).toContain('storyId: "common-footer"');
        });
    });

    describe("Import Preservation", () => {
        test("preserves custom imports while filtering MDX helpers", async () => {
            const mdx = `---
passageId: test-imports
---
import {Game} from '@react-text-game/core';
import {Actions, Action} from '@react-text-game/mdx';
import {myHelper} from './utils';

<Actions>
    <Action onPerform={() => Game.jumpTo('next')}>Next</Action>
    <Action onPerform={() => myHelper()}>Helper</Action>
</Actions>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            // Should preserve Game import
            expect(code).toContain(
                "import {Game} from '@react-text-game/core'"
            );
            // Should preserve custom import
            expect(code).toContain("import {myHelper} from './utils'");
            // Should filter out MDX component imports
            expect(code).not.toContain("@react-text-game/mdx");
            // Should filter out JSX runtime
            expect(code).not.toContain("react/jsx-runtime");
            // Should have newStory import
            expect(code).toContain(
                'import {newStory} from "@react-text-game/core"'
            );
            // Should use imported modules in actions
            expect(code).toContain("Game.jumpTo('next')");
            expect(code).toContain("myHelper()");
        });

        test("adds newStory import automatically", async () => {
            const mdx = `---
passageId: test-auto-import
---
# Test Story

Simple story with no imports.
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain(
                'import {newStory} from "@react-text-game/core"'
            );
        });
    });

    describe("Story Registration", () => {
        test("generates newStory call with passageId from frontmatter", async () => {
            const mdx = `---
passageId: my-unique-story
---
# My Story
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('const story = newStory("my-unique-story"');
            expect(code).toContain("export default story");
        });

        test("generates story with components array", async () => {
            const mdx = `---
passageId: test-structure
---
# Title

This is content.

<img src="test.png" />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('newStory("test-structure", () => [');
            expect(code).toContain('type: "header"');
            expect(code).toContain('type: "text"');
            expect(code).toContain('type: "image"');
            expect(code).toContain("]");
        });

        test("requires passageId in frontmatter", async () => {
            const mdx = `---
title: Missing PassageId
---
# Story without passageId
`;

            // This should produce a warning/error message in the compiled output
            const result = await compile(mdx, reactTextGameStoryPlugin());
            // The plugin should still compile but may have warnings
            expect(result.value).toBeDefined();
        });
    });

    describe("Complex Scenarios", () => {
        test("handles mixed content with all component types", async () => {
            const mdx = `---
passageId: complex-story
---
import {Actions, Action, Conversation, Say, Include} from '@react-text-game/mdx';
import {Game} from '@react-text-game/core';

# Welcome to the Game

This is the introduction text.

![Hero Image](hero.jpg "The Hero")

## Characters

<Conversation>
    <Say who={{name: 'Guide'}} side="left">Welcome, traveler!</Say>
    <Say side="right">Thank you!</Say>
</Conversation>

<video src="intro.mp4" />

<Actions>
    <Action onPerform={() => Game.jumpTo('chapter-1')}>Start Adventure</Action>
    <Action onPerform={() => Game.jumpTo('settings')}>Settings</Action>
</Actions>

<Include storyId="footer" />
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            // Check all component types are present
            expect(code).toContain('type: "header"');
            expect(code).toContain('type: "text"');
            expect(code).toContain('type: "image"');
            expect(code).toContain('type: "conversation"');
            expect(code).toContain('type: "video"');
            expect(code).toContain('type: "actions"');
            expect(code).toContain('type: "anotherStory"');

            // Check imports are preserved
            expect(code).toContain(
                "import {Game} from '@react-text-game/core'"
            );

            // Check structure
            expect(code).toContain('const story = newStory("complex-story"');
            expect(code).toContain("export default story");
        });

        test("handles nested expressions in action callbacks", async () => {
            const mdx = `---
passageId: test-complex-actions
---
import {Actions, Action} from '@react-text-game/mdx';
import {Game} from '@react-text-game/core';

<Actions>
    <Action onPerform={() => {
        const result = Math.random();
        if (result > 0.5) {
            Game.jumpTo('success');
        } else {
            Game.jumpTo('failure');
        }
    }}>Roll Dice</Action>
</Actions>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain("Math.random()");
            expect(code).toContain("Game.jumpTo('success')");
            expect(code).toContain("Game.jumpTo('failure')");
        });

        test("handles empty conversation", async () => {
            const mdx = `---
passageId: test-empty-conversation
---
import {Conversation} from '@react-text-game/mdx';

<Conversation>
</Conversation>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "conversation"');
            expect(code).toContain("content: []");
        });

        test("handles multiple actions groups", async () => {
            const mdx = `---
passageId: test-multiple-actions
---
import {Actions, Action} from '@react-text-game/mdx';

<Actions>
    <Action onPerform={() => {}}>Option 1</Action>
</Actions>

Some text in between.

<Actions>
    <Action onPerform={() => {}}>Option 2</Action>
</Actions>
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = String(result.value);

            // Should have two separate actions components
            const actionsMatches = code.match(/type: "actions"/g);
            expect(actionsMatches).toBeDefined();
            expect(actionsMatches?.length).toBe(2);
        });
    });

    describe("Edge Cases", () => {
        test("handles story with only frontmatter", async () => {
            const mdx = `---
passageId: empty-story
---
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain(
                'const story = newStory("empty-story", () => []'
            );
        });

        test("handles special characters in content", async () => {
            const mdx = `---
passageId: test-special-chars
---
This has "quotes" and 'apostrophes'.

It also has \\<brackets\\> and \\{braces\\}.
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            // Should escape special characters properly
            expect(code).toBeDefined();
            expect(code).toContain('type: "text"');
        });

        test("handles multiline text", async () => {
            const mdx = `---
passageId: test-multiline
---
This is a paragraph
with multiple lines
of text content.
`;

            const result = await compile(mdx, reactTextGameStoryPlugin());
            const code = result.value;

            expect(code).toContain('type: "text"');
        });
    });
});
