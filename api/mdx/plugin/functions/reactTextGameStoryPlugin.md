# Function: reactTextGameStoryPlugin()

> **reactTextGameStoryPlugin**(): `Pick`\<`ProcessorOptions`, `"recmaPlugins"` \| `"remarkPlugins"`\>

Defined in: [index.ts:50](https://github.com/laruss/react-text-game/blob/9aa52c3412169f451c3f63f9c39fe9fb6e314383/packages/mdx/src/plugins/index.ts#L50)

MDX processor plugin for auto-registering stories on import.
This variant transforms MDX files into self-registering story modules.

When a user imports an MDX file processed with this plugin,
the story is automatically registered with the Game engine using
`newStory()` with the passageId from frontmatter.

## Returns

`Pick`\<`ProcessorOptions`, `"recmaPlugins"` \| `"remarkPlugins"`\>

Processor options with remark and recma plugins for auto-registration

## Examples

```typescript
// In bundler config (e.g., vite.config.ts):
import { reactTextGameStoryPlugin } from '@react-text-game/mdx/plugin';

export default {
  plugins: [
    mdx({
      ...reactTextGameStoryPlugin()
    })
  ]
}
```

```mdx
---
passageId: intro
---
# Welcome
Your adventure begins...
```

```typescript
// User imports MDX file - story auto-registers
import './intro.mdx'

// Or with named import to access Story instance
import introStory from './intro.mdx'
```
