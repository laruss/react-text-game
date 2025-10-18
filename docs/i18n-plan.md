# i18n Integration Plan for react-text-game

## Overview

This document outlines the proposed internationalization (i18n) system for the react-text-game engine, featuring automatic translation file generation from passage code.

---

## 1. User Experience Flow

### Game.init() Configuration

```typescript
await Game.init({
  gameName: "My Adventure",
  gameVersion: "1.0.0",
  translations: {
    defaultLanguage: 'es', // default language for new games, defaults to 'en'
    supportedLanguages: ['en', 'es', 'fr'], // languages supported by game, defaults to ['en']
    translationsPath: './src/i18n', // where generated files go, defaults to src/i18n
  }
});
```

### CLI Script Usage

```bash
# User runs this to scan and generate translation files
bun run rtg-i18n generate
```

---

## 2. What Gets Auto-Generated

### A. For Game Passages (User Content)

The script should scan:
- **TypeScript files** - Extract strings from `newStory()`, `newInteractiveMap()` display functions
- **MDX files** - Extract all text content, headers, and frontmatter

**Generated structure:**
```
src/translations/
├── passages/
│   ├── en/
│   │   ├── start.json
│   │   ├── forest.json
│   │   └── inn.json
│   ├── es/
│   │   ├── start.json  (default - filled with extracted text)
│   │   ├── forest.json
│   │   └── inn.json
│   └── fr/
│       ├── start.json  (empty templates for user to fill)
│       ├── forest.json
│       └── inn.json
```

**Example `start.json` for Spanish (default language - auto-filled):**
```json
{
  "header": "El Comienzo",
  "text": "Te despiertas en un bosque oscuro...",
  "actions": {
    "explore": "Explorar el bosque",
    "rest": "Descansar"
  }
}
```

**Example `start.json` for English (non-default - template):**
```json
{
  "header": "",  // User fills this
  "text": "",    // User fills this
  "actions": {
    "explore": "",
    "rest": ""
  }
}
```

### B. For UI Components (Package Strings)

The `@react-text-game/ui` package will ship with English translations pre-integrated.

**UI package structure (pre-built):**
```
packages/ui/src/i18n/
├── locales/
│   └── en/
│       ├── ui.json      (common UI strings)
│       ├── saves.json   (save/load modal)
│       ├── devMode.json (dev mode drawer)
│       └── errors.json  (error messages)
```

**User's project structure:**

When the user runs the CLI script, it will:
1. Copy UI translation files from `@react-text-game/ui` package to their project
2. Generate translation JSON files for their selected languages
3. **Generate shadow TypeScript files with `t()` functions** in the `translations/` folder

```
src/
├── passages/                 # User's original clean code
│   ├── start.ts             # Original: header: 'El Comienzo'
│   ├── forest.ts
│   └── inn.mdx
└── translations/
    ├── passages/            # Generated shadow files with t() calls
    │   ├── start.ts         # Generated: header: t('header')
    │   ├── forest.ts        # Generated with t() functions
    │   └── inn.mdx          # Generated with {{t}} syntax
    ├── locales/             # Translation JSON files
    │   ├── en/
    │   │   ├── passages/
    │   │   │   ├── start.json
    │   │   │   ├── forest.json
    │   │   │   └── inn.json
    │   │   └── ui/
    │   │       ├── ui.json
    │   │       ├── saves.json
    │   │       └── devMode.json
    │   ├── es/              # Default language - auto-filled
    │   │   ├── passages/
    │   │   │   ├── start.json
    │   │   │   └── ...
    │   │   └── ui/
    │   │       └── ...
    │   └── fr/              # Empty templates for user to fill
    │       └── ...
    └── config.json          # Generated i18n configuration
```

**Key concepts:**

1. **User writes clean code** in `src/passages/` without any i18n boilerplate
2. **CLI generates shadow files** in `translations/passages/` with `t()` calls
3. **In development:** App imports from `src/passages/` (original files)
4. **In production:** Build process imports from `translations/passages/` (i18n-wrapped files)
5. **Users can override UI translations** by editing files in `translations/locales/ui/`

---

## 2.1. Shadow File Generation & Build Process

### Development Workflow

1. **User writes clean code:**
```typescript
// src/passages/start.ts
import { newStory } from '@react-text-game/core';

export const start = newStory('start', () => {
  return {
    header: 'El Comienzo',
    text: 'Te despiertas en un bosque oscuro...',
    actions: [
      { text: 'Explorar el bosque', onClick: () => Game.jumpTo('forest') }
    ]
  };
});
```

2. **CLI generates shadow file:**
```typescript
// translations/passages/start.ts (GENERATED - DO NOT EDIT)
import { newStory } from '@react-text-game/core';
import { usePassageTranslation } from '@react-text-game/core/i18n';

export const start = newStory('start', () => {
  const { t } = usePassageTranslation('start');
  return {
    header: t('header'),
    text: t('text'),
    actions: [
      { text: t('actions.explore'), onClick: () => Game.jumpTo('forest') }
    ]
  };
});
```

3. **CLI generates JSON:**
```json
// translations/locales/es/passages/start.json
{
  "header": "El Comienzo",
  "text": "Te despiertas en un bosque oscuro...",
  "actions": {
    "explore": "Explorar el bosque"
  }
}
```

### Watch Mode

```bash
# Start watch mode during development
bun run rtg-i18n watch

# Watches for changes in src/passages/**
# Automatically regenerates shadow files and updates JSONs
```

### Build Configuration (Transparent & Zero-Config)

**Decision: Always import from `translations/` - CLI handles everything**

The CLI will generate shadow files in `translations/passages/` that mirror the structure of `src/passages/`. Users always import from `translations/`.

**User's original code:**
```typescript
// src/passages/start.ts - User writes clean code here
export const start = newStory('start', () => {
  return {
    header: 'El Comienzo',
    text: 'Te despiertas...'
  };
});
```

**CLI generates two versions in translations folder:**

1. **Development version** (no i18n, just re-exports):
```typescript
// translations/passages/start.ts (when i18n disabled or in dev mode)
export * from '../../src/passages/start';
```

2. **Production version** (with i18n):
```typescript
// translations/passages/start.ts (when i18n enabled)
import { newStory } from '@react-text-game/core';
import { usePassageTranslation } from '@react-text-game/core/i18n';

export const start = newStory('start', () => {
  const { t } = usePassageTranslation('start');
  return {
    header: t('header'),
    text: t('text')
  };
});
```

**User always imports from translations:**
```typescript
// User's App.tsx
import { start } from './translations/passages/start';
import { forest } from './translations/passages/forest';

// No build configuration needed!
// CLI decides what to generate in translations/ folder
```

**Benefits:**
- ✅ Zero build configuration required
- ✅ Works with any bundler (Vite, Webpack, etc.)
- ✅ User doesn't need to understand aliases or path mapping
- ✅ CLI controls whether i18n is active via what it generates
- ✅ TypeScript autocomplete works perfectly
- ✅ Can switch between dev/prod by regenerating files

**CLI commands control behavior:**
```bash
# Development mode - generates re-export files (no i18n overhead)
bun run rtg-i18n generate --mode dev

# Production mode - generates i18n-wrapped files
bun run rtg-i18n generate --mode prod

# Watch mode (respects --mode flag)
bun run rtg-i18n watch --mode prod
```

---

## 3. Key Technical Decisions

### Question 1: Auto-extraction Strategy (Chosen: Auto-detect)

**Decision: Auto-detect all strings from specific locations**

We'll automatically extract ALL string literals from passage display functions. This is safer than it sounds because we know exactly where to look:
- Inside `newStory()` display function return objects
- Inside `newInteractiveMap()` display function return objects
- Inside MDX file content (excluding frontmatter)

```typescript
// CLI scans and extracts ALL string literals automatically
newStory('start', () => {
  return {
    header: 'El Comienzo',  // ✅ Auto-extracted
    text: 'Te despiertas...',  // ✅ Auto-extracted
    actions: [
      { text: 'Explorar', onClick: () => Game.jumpTo('forest') }  // ✅ Auto-extracted
    ]
  };
});
```

**Pros:**
- Zero code changes needed
- Clean user code without i18n boilerplate
- Clear structure means less risk of extracting wrong strings

**Cons:**
- Need to handle edge cases (variables, expressions)

---

### Question 1.1: How to handle dynamic variables in TypeScript passages?

When passages use variables or expressions instead of string literals:

```typescript
const playerName = Storage.getValue('player.name');

newStory('greeting', () => {
  return {
    text: `Hello, ${playerName}!`,  // ❌ Template literal with variable
    header: playerName.toUpperCase(),  // ❌ Expression, not a literal
  };
});
```

#### Option A - Skip non-literals (recommended)

- Only extract pure string literals
- Variables/expressions are left as-is in the code
- User manually handles dynamic content

**Generated JSON:**
```json
{
  // No 'text' or 'header' - skipped because not pure strings
}
```

**User must refactor to:**
```typescript
newStory('greeting', ({ t }) => {
  const playerName = Storage.getValue('player.name');
  return {
    text: t('text', { name: playerName }),  // Use interpolation
    header: playerName.toUpperCase(),
  };
});
```

#### Option B - Extract template with placeholders

- Parse template literals
- Extract static parts
- Generate placeholders for variables

**Generated JSON:**
```json
{
  "text": "Hello, {{name}}!",  // Placeholder for playerName
}
```

**Runtime automatically replaces:**
```typescript
// Framework detects variables and injects them
newStory('greeting', () => {
  const playerName = Storage.getValue('player.name');
  return {
    text: `Hello, ${playerName}!`,  // Works automatically with i18n
  };
});
```

#### Option C - Warn and document

- CLI shows warning: "⚠ Found dynamic content in passage 'greeting', skipped"
- Documentation explains how to use `t()` function for dynamic content
- User explicitly opts-in when needed

**Recommendation:** **Option B for template literals** (most common case) + **Option A for complex expressions** + **Option C for edge cases** (warn user).

---

### Question 1.2: How to handle React components and expressions in MDX files?

MDX files can contain JSX components and expressions that shouldn't be translated:

```mdx
---
id: inventory
---

# Your Inventory

You have {playerGold} gold coins.

<InventoryGrid items={playerItems} />

Click [[here->shop]] to visit the shop.
```

What should be extracted?

#### Option A - Extract only markdown text (recommended)

- Extract plain text: `# Your Inventory`, `Click`, `to visit the shop`
- Skip JSX expressions: `{playerGold}`
- Skip JSX components: `<InventoryGrid />`
- Skip link targets: `->shop` (these are passage IDs, not translatable)
- Extract link text: `here`

**Generated JSON:**
```json
{
  "heading": "Your Inventory",
  "text": "You have {playerGold} gold coins.",  // Preserve placeholder
  "link_shop": "here",
  "text_2": "to visit the shop"
}
```

#### Option B - Mark components as untranslatable zones

- User adds `data-i18n="false"` to components they don't want scanned
- Everything else is extracted

```mdx
<InventoryGrid items={playerItems} data-i18n="false" />
```

#### Option C - Smart component detection

- CLI recognizes React component tags (PascalCase)
- Automatically skips component tags and their props
- Only extracts markdown text and link text

**Recommendation:** **Option A + Option C** (smart detection with markdown-only extraction). Components and expressions are naturally skipped.

**Special handling for expressions:**
- `{playerGold}` → Keep as placeholder `{playerGold}` in translation
- MDX expression syntax is preserved in JSON for runtime replacement

---

### Question 2: MDX Translation Strategy

#### Option A - Frontmatter-based

```mdx
---
id: start
i18n: start.passage
---

# {{t 'header'}}  <!-- References i18n/passages/{lang}/start.json -->

{{t 'text'}}

[[{{t 'actions.explore'}}->forest]]
```

#### Option B - Separate MDX files per language

```
passages/
├── en/
│   └── start.mdx
├── es/
│   └── start.mdx  (default)
└── fr/
    └── start.mdx
```

**Pros:** Easier for non-technical translators
**Cons:** File duplication, harder to maintain

#### Option C - JSON-only (recommended)

```
passages/
├── start.mdx  (structure only)
└── i18n/passages/{lang}/start.json  (all text)
```

MDX becomes a template, all text comes from JSON.

**Decision needed: Which approach makes most sense for users?**

---

### Question 3: Runtime Integration

How should passages access translations at runtime?

#### Option A - Automatic injection (recommended)

```typescript
// Framework automatically provides t() function in display context
newStory('start', ({ t }) => {  // t() injected by framework
  return {
    header: t('header'),
    text: t('text'),
  };
});
```

#### Option B - Import from core

```typescript
import { useGameTranslation } from '@react-text-game/core/i18n';

newStory('start', () => {
  const { t } = useGameTranslation('start');  // namespace: 'start'
  return { header: t('header') };
});
```

#### Option C - Direct JSON imports

```typescript
import startEn from './i18n/passages/en/start.json';
import startEs from './i18n/passages/es/start.json';

// Framework handles switching based on Game.options.i18n.currentLanguage
```

**Decision needed: Which approach?**

---

### Question 4: Translation File Updates

When user adds new passages or modifies existing ones:

#### Option A - Incremental update (recommended)

```bash
bun run rtg-i18n update
# Only scans changed files
# Merges new keys into existing translations
# Preserves user's existing translations
```

#### Option B - Full regeneration

```bash
bun run rtg-i18n generate --force
# Regenerates everything
# User translations preserved via backup/merge strategy
```

**Decision needed: Support both?**

---

## 4. Package Structure Proposal

### Option A - New package `@react-text-game/i18n`

```
packages/i18n/
├── src/
│   ├── cli/
│   │   ├── generate.ts   # CLI commands
│   │   └── update.ts
│   ├── scanner/
│   │   ├── typescript.ts # TS/TSX parser
│   │   ├── mdx.ts        # MDX parser
│   │   └── ui.ts         # UI component scanner
│   ├── runtime/
│   │   ├── provider.tsx  # I18nProvider component
│   │   ├── hooks.ts      # useTranslation, etc.
│   │   └── context.ts
│   └── index.ts
└── package.json
```

### Option B - Split into core + CLI

- `@react-text-game/core` - Runtime i18n (hooks, provider)
- `@react-text-game/cli` - Code generation tools

**Decision needed: Which structure?**

---

## 5. Configuration File

### Proposed `rtg-i18n.config.js`

```javascript
export default {
  defaultLanguage: 'es',
  supportedLanguages: ['en', 'es', 'fr'],

  // Where to scan
  scan: {
    passages: ['./src/passages/**/*.{ts,tsx,mdx}'],
    ui: ['./src/components/**/*.{ts,tsx}'],
  },

  // Where to output
  output: {
    passages: './src/i18n/passages',
    ui: './src/i18n/ui',
  },

  // Extraction strategy
  extractionMode: 'explicit', // 'explicit' | 'auto' | 'comments'

  // MDX handling
  mdx: {
    strategy: 'json-only', // 'json-only' | 'separate-files' | 'frontmatter'
  },
};
```

---

## 6. Implementation Priority

### Suggested Phases

1. **Phase 1:** Basic TypeScript passage scanning + JSON generation
2. **Phase 2:** MDX support
3. **Phase 3:** UI component scanning
4. **Phase 4:** Runtime provider + hooks

**Decision needed: Agree with this order?**

---

## 7. User-Facing Documentation

### Required Documentation Sections

1. **Quick Start** - Setup i18n in 5 minutes
2. **CLI Reference** - All commands and options
3. **Translation Workflow** - How to add/update translations
4. **API Reference** - Runtime hooks and components
5. **Custom Components** - How to make user's custom UI translatable
6. **Best Practices** - Organizing large multilingual games

---

## Recommendations Summary

Based on best practices and requirements:

1. **Extraction:** Option A (explicit `t()` markers) - clearest intent
2. **MDX:** Option C (JSON-only) - easiest to maintain
3. **Runtime:** Option A (automatic injection) - best DX
4. **Updates:** Support both incremental and full regeneration
5. **Package:** Option A (dedicated `@react-text-game/i18n` package)
6. **Config:** Yes, use `rtg-i18n.config.js` for flexibility

---

## Next Steps

1. Review and finalize technical decisions
2. Create package structure
3. Implement CLI tooling
4. Build runtime integration
5. Write comprehensive documentation
6. Create example multilingual game

---

## Questions for Discussion

- Which string extraction strategy (explicit/auto/comments)?
- MDX translation approach preference?
- Runtime integration pattern?
- Package structure preference?
- Implementation phase priorities?
