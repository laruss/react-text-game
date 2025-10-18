# i18n Integration Plan V1 (Simple)

## Overview

This is a simplified, manual approach to i18n integration for experienced developers. It provides the foundation for internationalization without CLI tooling or automatic code generation.

**Target audience:** Developers comfortable with i18n libraries and manual integration.

**Scope:** TypeScript passages only (MDX instructions provided separately).

---

## 1. Architecture

### Package Integration

We'll integrate `react-i18next` into the core packages:

**Dependencies to add:**
```json // packages/core/package.json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0"
  }
}
```

```json // packages/ui/package.json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0"
  }
}
```

---

## 2. Game.init() Configuration

Add i18n configuration to Game initialization with user's translation resources:

```typescript
import commonEn from './locales/en/common.json';
import passagesEn from './locales/en/passages.json';
import commonEs from './locales/es/common.json';
import passagesEs from './locales/es/passages.json';

await Game.init({
  gameName: "My Adventure",
  gameVersion: "1.0.0",
  i18n: {
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    debug: false, // Enable i18next debug mode
    resources: {
      en: {
        common: commonEn,
        passages: passagesEn,
      },
      es: {
        common: commonEs,
        passages: passagesEs,
      }
    }
  }
});
```

**Game.init() will:**
1. Initialize i18next with provided configuration
2. Automatically merge UI package translations with user translations
3. Set up language switching functionality
4. Handle all i18next boilerplate internally

---

## 3. User Project Structure

Users only create translation JSON files - no configuration code needed:

```
src/
├── passages/
│   ├── start.ts
│   ├── forest.ts
│   └── inn.ts
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   └── passages.json
│   ├── es/
│   │   ├── common.json
│   │   └── passages.json
│   └── fr/
│       ├── common.json
│       └── passages.json
└── App.tsx
```

**Note:** No `i18n/index.ts` file needed - `Game.init()` handles all configuration!

---

## 4. Core Package Changes

### 4.1. Export i18n utilities from `@react-text-game/core`

**New exports:**

```typescript
// packages/core/src/i18n/index.ts
export { initI18n } from './init';
export { useGameTranslation } from './hooks';
export { changeLanguage, getCurrentLanguage } from './utils';
export type { I18nConfig } from './types';
```

### 4.2. i18n initialization in Game.init()

```typescript
// packages/core/src/game.ts
import { initI18n } from '#i18n';

class Game {
  static async init(opts: NewOptions): Promise<void> {
    newOptions(opts);

    // Initialize i18n if configured
    if (opts.i18n) {
      await initI18n(opts.i18n);
    }

    // ... rest of initialization
  }
}
```

**Note:** The `initI18n()` function uses dynamic imports to load UI package translations. This makes the UI package optional - if it's not installed (e.g., users building custom UIs), the core package will continue to work without UI translations.

**Internal i18n initialization:**

```typescript
// packages/core/src/i18n/init.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getSetting } from '#saves/db';

export interface I18nConfig {
  defaultLanguage?: string;
  fallbackLanguage?: string;
  debug?: boolean;
  resources: {
    [language: string]: {
      [namespace: string]: object;
    };
  };
}

/**
 * Safely load UI translations from @react-text-game/ui package.
 * Returns empty object if UI package is not installed.
 */
async function loadUITranslations(): Promise<Record<string, Record<string, object>>> {
  try {
    const { uiTranslations } = await import('@react-text-game/ui/i18n');
    return uiTranslations;
  } catch (error) {
    // UI package not installed - this is expected for users with custom UIs
    return {};
  }
}

export async function initI18n(config: I18nConfig) {
  const {
    defaultLanguage = 'en',
    fallbackLanguage = 'en',
    debug = false,
    resources,
  } = config;

  // Try to load UI translations (will be empty if UI package not installed)
  const uiTranslations = await loadUITranslations();

  // Merge user resources with UI translations
  const mergedResources: typeof resources = {};

  for (const [lang, namespaces] of Object.entries(resources)) {
    mergedResources[lang] = {
      ...namespaces,
      // Auto-merge UI translations if available for this language
      ...(uiTranslations[lang] || {}),
    };
  }

  // Add UI translations for languages not provided by user
  for (const [lang, translations] of Object.entries(uiTranslations)) {
    if (!mergedResources[lang]) {
      mergedResources[lang] = translations;
    }
  }

  // Load saved language preference from database (if available)
  const savedLanguage = await getSetting<string>('language', defaultLanguage);

  await i18next
    .use(initReactI18next)
    .init({
      lng: savedLanguage, // Use saved language or default
      fallbackLng: fallbackLanguage,
      defaultNS: 'common',
      debug,
      resources: mergedResources,
      interpolation: {
        escapeValue: false, // React already escapes
      },
    });
}
```

### 4.3. Translation hook for passages

```typescript
// packages/core/src/i18n/hooks.ts
import { useTranslation } from 'react-i18next';
import { setSetting } from '#saves/db';

export function useGameTranslation(namespace: string = 'passages') {
  const { t, i18n } = useTranslation(namespace);

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    // Persist language preference to database
    await setSetting('language', lang);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
    languages: i18n.languages,
  };
}
```

---

## 5. UI Package Changes

### 5.1. Pre-built English translations

Create translation files for all UI components:

```
packages/ui/src/i18n/
├── locales/
│   └── en/
│       ├── ui.json
│       ├── saves.json
│       ├── devMode.json
│       └── errors.json
└── index.ts
```

**Example: `packages/ui/src/i18n/locales/en/ui.json`**
```json
{
  "mainMenu": {
    "title": "Main Menu",
    "newGame": "New Game",
    "continue": "Continue",
    "loadGame": "Load Game"
  }
}
```

**Example: `packages/ui/src/i18n/locales/en/saves.json`**
```json
{
  "title": {
    "save": "Save Game",
    "load": "Load Game",
    "saveLoad": "Save / Load Game"
  },
  "slot": {
    "label": "Slot {{number}}",
    "empty": "Empty Slot",
    "saveHere": "Save Here",
    "overwrite": "Overwrite"
  },
  "actions": {
    "load": "Load",
    "loading": "Loading...",
    "save": "Save",
    "saving": "Saving...",
    "delete": "Delete",
    "close": "Close"
  },
  "errors": {
    "actionFailed": "An error occurred. Please check the console for details."
  }
}
```

### 5.2. Update UI components to use translations

**Example: MainMenu.tsx**

```tsx
// Before
export const MainMenu = () => {
  return (
    <div>
      <h1>Main Menu</h1>
      <Button>New Game</Button>
      <Button>Continue</Button>
      <Button>Load Game</Button>
    </div>
  );
};
```

```tsx
// After
import { useTranslation } from 'react-i18next';

export const MainMenu = () => {
  const { t } = useTranslation('ui');

  return (
    <div>
      <h1>{t('mainMenu.title')}</h1>
      <Button>{t('mainMenu.newGame')}</Button>
      <Button>{t('mainMenu.continue')}</Button>
      <Button>{t('mainMenu.loadGame')}</Button>
    </div>
  );
};
```

### 5.3. Export UI translations

```typescript
// packages/ui/src/i18n/index.ts
import uiEn from './locales/en/ui.json';
import savesEn from './locales/en/saves.json';
import devModeEn from './locales/en/devMode.json';
import errorsEn from './locales/en/errors.json';

export const uiTranslations = {
  en: {
    ui: uiEn,
    saves: savesEn,
    devMode: devModeEn,
    errors: errorsEn,
  },
};

export * from './types';
```

---

## 6. User Implementation Guide

### 6.1. Setup i18n in user's project

**No separate i18n configuration file needed!** Just import your translations and pass them to `Game.init()`:

```typescript
// App.tsx or main.tsx
import { Game } from '@react-text-game/core';

// Import user's translations
import commonEn from './locales/en/common.json';
import passagesEn from './locales/en/passages.json';
import commonEs from './locales/es/common.json';
import passagesEs from './locales/es/passages.json';

await Game.init({
  gameName: "My Adventure",
  gameVersion: "1.0.0",
  i18n: {
    defaultLanguage: 'en',
    fallbackLanguage: 'en',
    resources: {
      en: {
        common: commonEn,
        passages: passagesEn,
      },
      es: {
        common: commonEs,
        passages: passagesEs,
      }
    }
  }
});
```

**That's it!** The core package:
- Automatically initializes i18next
- Merges UI package translations
- Handles all boilerplate
- Makes translations available to all hooks

### 6.2. Create translation files

**`src/locales/en/passages.json`:**
```json
{
  "start": {
    "header": "The Beginning",
    "text": "You wake up in a dark forest...",
    "actions": {
      "explore": "Explore the forest",
      "rest": "Rest"
    }
  },
  "forest": {
    "header": "The Forest",
    "text": "Trees surround you..."
  }
}
```

**`src/locales/es/passages.json`:**
```json
{
  "start": {
    "header": "El Comienzo",
    "text": "Te despiertas en un bosque oscuro...",
    "actions": {
      "explore": "Explorar el bosque",
      "rest": "Descansar"
    }
  },
  "forest": {
    "header": "El Bosque",
    "text": "Los árboles te rodean..."
  }
}
```

### 6.3. Use translations in passages

**`src/passages/start.ts`:**

```typescript
import { newStory, Game } from '@react-text-game/core';
import { useGameTranslation } from '@react-text-game/core/i18n';

export const start = newStory('start', () => {
  const { t } = useGameTranslation('passages');

  return {
    header: t('start.header'),
    text: t('start.text'),
    actions: [
      {
        text: t('start.actions.explore'),
        onClick: () => Game.jumpTo('forest')
      },
      {
        text: t('start.actions.rest'),
        onClick: () => Game.jumpTo('inn')
      }
    ]
  };
});
```

### 6.4. Initialize in App.tsx

```typescript
import { useEffect } from 'react';
import { Game } from '@react-text-game/core';
import { GameProvider } from '@react-text-game/ui';

// Import translations
import commonEn from './locales/en/common.json';
import passagesEn from './locales/en/passages.json';
import commonEs from './locales/es/common.json';
import passagesEs from './locales/es/passages.json';

function App() {
  useEffect(() => {
    const init = async () => {
      await Game.init({
        gameName: "My Adventure",
        gameVersion: "1.0.0",
        i18n: {
          defaultLanguage: 'en',
          fallbackLanguage: 'en',
          resources: {
            en: {
              common: commonEn,
              passages: passagesEn,
            },
            es: {
              common: commonEs,
              passages: passagesEs,
            }
          }
        }
      });
    };

    init();
  }, []);

  return (
    <GameProvider>
      {/* Your app */}
    </GameProvider>
  );
}
```

---

## 7. Language Switching

### 7.1. Built-in Language Switcher Component

The UI package provides a ready-to-use `<LanguageSwitcher />` component:

```tsx
import { LanguageSwitcher } from '@react-text-game/ui';

function App() {
  return (
    <div>
      <LanguageSwitcher />
      {/* Your game content */}
    </div>
  );
}
```

**Features:**
- Automatically detects available languages from i18n configuration
- Displays language names in their native language (e.g., "English", "Español", "Français")
- Themed to match your game's design system
- Supports customization via props

**Props:**
```tsx
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons' | 'flags'; // UI style
  labels?: Record<string, string>; // Custom language labels
  className?: string; // Custom styling
  showCurrentOnly?: boolean; // Show only current language when collapsed
}
```

**Example with custom labels:**
```tsx
<LanguageSwitcher
  variant="buttons"
  labels={{
    en: 'English',
    es: 'Español',
    fr: 'Français',
  }}
/>
```

### 7.2. Create custom language switcher

Users can also create their own language switcher using the `useGameTranslation` hook:

```tsx
import { useGameTranslation } from '@react-text-game/core/i18n';

export const CustomLanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useGameTranslation();

  return (
    <div className="my-custom-switcher">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={currentLanguage === lang ? 'active' : ''}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
```

**Available from `useGameTranslation()`:**
- `currentLanguage: string` - The currently active language code
- `changeLanguage: (lang: string) => Promise<void>` - Function to switch languages
- `languages: string[]` - Array of all available language codes
- `t: (key: string) => string` - Translation function for current namespace

---

## 8. Language Preference Persistence

The core package automatically saves and restores the user's language preference using the existing save system.

### 8.1. How it works

**When user changes language:**
```typescript
const { changeLanguage } = useGameTranslation();

// This automatically saves to database
await changeLanguage('es');
```

**Internal implementation:**
```typescript
// packages/core/src/i18n/hooks.ts
const changeLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  // Automatically persist to database using settings table
  await setSetting('language', lang);
};
```

**On game initialization:**
```typescript
// packages/core/src/i18n/init.ts
// Load saved language preference from database
const savedLanguage = await getSetting<string>('language', defaultLanguage);

await i18next.init({
  lng: savedLanguage, // Use saved language or default
  // ... rest of config
});
```

### 8.2. Benefits

- **Automatic persistence** - Users don't need to do anything
- **Survives page refresh** - Language choice is remembered
- **Per-game storage** - Each game has its own language setting
- **Uses existing infrastructure** - Leverages the settings table in IndexedDB

### 8.3. Database schema

The language preference is stored in the `settings` table:

```typescript
{
  key: 'language',
  value: 'es', // The language code
  timestamp: Date,
  version: '1.0.0'
}
```

This is the same table used for other game settings, so no additional database setup is required.

---

## 9. Override UI Translations

Users can override UI component translations by providing them in their resources:

```typescript
// App.tsx
import commonEs from './locales/es/common.json';
import passagesEs from './locales/es/passages.json';

// Optional: custom UI translations
import uiEs from './locales/es/ui.json';
import savesEs from './locales/es/saves.json';

await Game.init({
  gameName: "My Adventure",
  gameVersion: "1.0.0",
  i18n: {
    resources: {
      es: {
        common: commonEs,
        passages: passagesEs,
        // Override UI translations for Spanish
        ui: uiEs,
        saves: savesEs,
      }
    }
  }
});
```

**Example `src/locales/es/ui.json`:**
```json
{
  "mainMenu": {
    "title": "Menú Principal",
    "newGame": "Nuevo Juego",
    "continue": "Continuar",
    "loadGame": "Cargar Juego"
  }
}
```

The core package automatically merges user translations with UI package defaults, giving priority to user translations.

---

## 9. MDX Files (Manual Approach)

For MDX files, users need to manually integrate i18n:

### Option A - Use trans component

```mdx
---
id: start
---

import { Trans } from 'react-i18next';

# <Trans i18nKey="passages.start.header">The Beginning</Trans>

<Trans i18nKey="passages.start.text">
You wake up in a dark forest...
</Trans>

[[<Trans i18nKey="passages.start.actions.explore">Explore</Trans>->forest]]
```

### Option B - Create wrapper components

**Create `src/components/T.tsx`:**
```typescript
import { useTranslation } from 'react-i18next';

export const T = ({ k, children }: { k: string; children?: string }) => {
  const { t } = useTranslation('passages');
  return <>{t(k, children)}</>;
};
```

**Use in MDX:**
```mdx
---
id: start
---

import { T } from '../components/T';

# <T k="start.header">The Beginning</T>

<T k="start.text">You wake up in a dark forest...</T>

[[<T k="start.actions.explore">Explore</T>->forest]]
```

### Option C - Use data attributes (recommended for MDX)

Keep MDX simple and use separate translation JSON files. This is less ergonomic but cleanest:

```mdx
---
id: start
i18nKey: passages.start
---

# {header}

{text}

[[{actions.explore}->forest]]
```

Then create a custom MDX component that reads from i18n based on `i18nKey` from frontmatter. This requires custom MDX plugin development (documented separately).

---

## 10. Documentation to Create

### 10.1. For package users

1. **Quick Start Guide**
   - How to set up i18n in 5 minutes
   - Basic example with one passage

2. **API Reference**
   - `Game.init()` i18n options
   - `useGameTranslation()` hook
   - `changeLanguage()` function

3. **Translation File Structure**
   - Recommended namespace organization
   - Interpolation syntax
   - Pluralization

4. **Overriding UI Translations**
   - How to customize built-in UI strings
   - Available namespaces and keys

5. **MDX Integration Guide**
   - Three approaches with pros/cons
   - Code examples

### 10.2. For custom component developers

**Guide: "Making Your Custom Components Translatable"**

```typescript
// Your custom inventory component
import { useTranslation } from 'react-i18next';

export const CustomInventory = () => {
  const { t } = useTranslation('game'); // or your namespace

  return (
    <div>
      <h2>{t('inventory.title')}</h2>
      <p>{t('inventory.empty')}</p>
    </div>
  );
};
```

**Translation file:**
```json
{
  "inventory": {
    "title": "Your Inventory",
    "empty": "No items"
  }
}
```

---

## 11. Implementation Tasks

### Phase 1: Core Package
- [ ] Add `i18next` and `react-i18next` dependencies
- [ ] Create `packages/core/src/i18n/` directory
- [ ] Implement `initI18n()` function with:
  - [ ] Dynamic import helper (`loadUITranslations()`) to safely load UI package translations
  - [ ] Resource merging (user + UI translations)
  - [ ] Load saved language preference from database
  - [ ] Initialize i18next with saved or default language
- [ ] Implement `useGameTranslation()` hook with:
  - [ ] Translation function (`t`)
  - [ ] Language change function with database persistence
  - [ ] Current language getter
  - [ ] Available languages getter
- [ ] Add i18n initialization to `Game.init()`
- [ ] Export i18n utilities from core package
- [ ] Add TypeScript types for i18n config
- [ ] Add language persistence using existing settings table

### Phase 2: UI Package
- [ ] Add `i18next` and `react-i18next` dependencies
- [ ] Create `packages/ui/src/i18n/locales/en/` directory
- [ ] Extract all hardcoded strings to JSON files:
  - [ ] `ui.json` (MainMenu, common buttons)
  - [ ] `saves.json` (SaveLoadModal)
  - [ ] `devMode.json` (DevModeDrawer)
  - [ ] `errors.json` (ErrorBoundary)
  - [ ] `languageSwitcher.json` (LanguageSwitcher component)
- [ ] Update all UI components to use `useTranslation()`
- [ ] Create `LanguageSwitcher` component:
  - [ ] Implement dropdown variant
  - [ ] Implement buttons variant
  - [ ] Implement flags variant (optional)
  - [ ] Add customization props (labels, className, variant)
  - [ ] Auto-detect available languages from i18n config
  - [ ] Use semantic theming colors
- [ ] Export UI translations from `@react-text-game/ui/i18n`
- [ ] Export `LanguageSwitcher` component from `@react-text-game/ui`
- [ ] Test all UI components with translations

### Phase 3: Documentation
- [ ] Create Quick Start guide in docs
- [ ] Document `Game.init()` i18n options
- [ ] Document `useGameTranslation()` hook
- [ ] Create "Overriding UI Translations" guide
- [ ] Create "Custom Components i18n" guide
- [ ] Add MDX integration examples
- [ ] Create full example game with multiple languages

### Phase 4: Testing
- [ ] Create example game using i18n
- [ ] Test language switching
- [ ] Test language preference persistence:
  - [ ] Change language and refresh page
  - [ ] Verify language is remembered
  - [ ] Test with multiple games (each should have separate setting)
- [ ] Test UI translation overrides
- [ ] Test passage translations
- [ ] Verify TypeScript types work correctly

---

## 12. Benefits of V1 (Simple Approach)

✅ **No CLI tooling needed** - uses standard i18next setup
✅ **Zero boilerplate** - no manual i18next configuration required
✅ **Single initialization point** - everything configured in `Game.init()`
✅ **Automatic UI translations** - core package auto-merges UI translations when UI package is installed
✅ **UI package is optional** - dynamic imports gracefully handle missing UI package for custom UIs
✅ **Language persistence** - user's language choice automatically saved to database
✅ **Survives refresh** - language preference restored on page reload
✅ **Full control** - users manage their translation files
✅ **Quick to implement** - mostly integration work, not code generation
✅ **Foundation for V2** - establishes i18n architecture for future automation
✅ **TypeScript support** - full type safety with i18next
✅ **Flexible** - users can use any i18next plugins or backends
✅ **Override-friendly** - easy to customize UI translations per language
✅ **Leverages existing infrastructure** - uses existing settings table, no new database schema needed
✅ **Modern runtime compatibility** - dynamic imports work with all modern bundlers (Vite, Webpack 5+, esbuild, Rollup)

---

## 13. Limitations (Addressed in V2)

⚠️ **Manual translation file creation** - users must create JSON files themselves
⚠️ **Code duplication** - translation keys repeated in code and JSON
⚠️ **No auto-extraction** - strings must be manually copied to JSON
⚠️ **Manual imports** - users must import each translation file
⚠️ **MDX not fully integrated** - requires workarounds or manual components
⚠️ **No watch mode** - users must manually keep translations in sync
⚠️ **No CLI helpers** - no scaffolding or validation tools

These will be addressed in **V2** with automatic code generation and CLI tooling.

---

## 14. Summary: What Users Do vs What Packages Do

### Users Only Need To:

1. **Create translation JSON files** in `src/locales/{lang}/*.json`
2. **Import their translations** in their app entry point
3. **Pass translations to `Game.init()`** via the `i18n.resources` option

### Core Package Handles:

1. **All i18next setup** - initialization, configuration, plugins
2. **UI translations merging** - automatically includes UI package translations (if UI package is installed)
3. **Optional UI package** - gracefully handles missing UI package via dynamic imports
4. **Language management** - provides hooks and utilities for language switching
5. **Type safety** - provides TypeScript types for i18n configuration

### UI Package Provides:

1. **Pre-translated components** - all UI components use i18next
2. **English translations** - default translations for all UI strings
3. **Extensible namespaces** - users can override any UI translation

This division of responsibilities makes i18n **simple for users** while keeping the **framework powerful and flexible**.
