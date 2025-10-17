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
```json
// packages/core/package.json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0"
  }
}

// packages/ui/package.json
{
  "dependencies": {
    "i18next": "^23.0.0",
    "react-i18next": "^14.0.0"
  }
}
```

---

## 2. Game.init() Configuration

Add i18n configuration to Game initialization:

```typescript
await Game.init({
  gameName: "My Adventure",
  gameVersion: "1.0.0",
  i18n: {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'es', 'fr'],
    debug: false, // Enable i18next debug mode
  }
});
```

**Game.init() will:**
1. Initialize i18next with provided configuration
2. Load translation resources from user's project
3. Set up language switching functionality

---

## 3. User Project Structure

Users manually create translation files:

```
src/
├── passages/
│   ├── start.ts
│   ├── forest.ts
│   └── inn.ts
├── i18n/
│   ├── index.ts           # i18n configuration
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json
│   │   │   └── passages.json
│   │   ├── es/
│   │   │   ├── common.json
│   │   │   └── passages.json
│   │   └── fr/
│   │       ├── common.json
│   │       └── passages.json
└── App.tsx
```

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

### 4.3. Translation hook for passages

```typescript
// packages/core/src/i18n/hooks.ts
import { useTranslation } from 'react-i18next';

export function useGameTranslation(namespace: string = 'passages') {
  const { t, i18n } = useTranslation(namespace);

  return {
    t,
    changeLanguage: i18n.changeLanguage,
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

```typescript
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

**Create `src/i18n/index.ts`:**

```typescript
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { uiTranslations } from '@react-text-game/ui/i18n';

// Import user's translations
import commonEn from './locales/en/common.json';
import passagesEn from './locales/en/passages.json';
import commonEs from './locales/es/common.json';
import passagesEs from './locales/es/passages.json';

export const initI18n = async (defaultLanguage = 'en') => {
  await i18next
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      fallbackLng: 'en',
      defaultNS: 'common',

      resources: {
        en: {
          common: commonEn,
          passages: passagesEn,
          ...uiTranslations.en, // Include UI translations
        },
        es: {
          common: commonEs,
          passages: passagesEs,
          // User can override UI translations here
        },
      },

      interpolation: {
        escapeValue: false, // React already escapes
      },
    });
};
```

### 6.2. Create translation files

**`src/i18n/locales/en/passages.json`:**
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

**`src/i18n/locales/es/passages.json`:**
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
import { initI18n } from './i18n';

function App() {
  useEffect(() => {
    const init = async () => {
      // Initialize i18n first
      await initI18n('en');

      // Then initialize game
      await Game.init({
        gameName: "My Adventure",
        gameVersion: "1.0.0",
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

### 7.1. Create language switcher component

Users can create their own language switcher:

```typescript
import { useGameTranslation } from '@react-text-game/core/i18n';

export const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useGameTranslation();

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  );
};
```

---

## 8. Override UI Translations

Users can override UI component translations:

```typescript
// src/i18n/index.ts
import { uiTranslations } from '@react-text-game/ui/i18n';

export const initI18n = async (defaultLanguage = 'en') => {
  await i18next.init({
    resources: {
      en: {
        ...uiTranslations.en,
      },
      es: {
        // Override UI translations for Spanish
        ui: {
          mainMenu: {
            title: "Menú Principal",
            newGame: "Nuevo Juego",
            continue: "Continuar",
            loadGame: "Cargar Juego"
          }
        },
        saves: {
          title: {
            save: "Guardar Partida",
            load: "Cargar Partida",
            saveLoad: "Guardar / Cargar"
          },
          // ... rest of overrides
        }
      }
    }
  });
};
```

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
- [ ] Implement `initI18n()` function
- [ ] Implement `useGameTranslation()` hook
- [ ] Add i18n initialization to `Game.init()`
- [ ] Export i18n utilities from core package
- [ ] Add TypeScript types for i18n config

### Phase 2: UI Package
- [ ] Add `i18next` and `react-i18next` dependencies
- [ ] Create `packages/ui/src/i18n/locales/en/` directory
- [ ] Extract all hardcoded strings to JSON files:
  - [ ] `ui.json` (MainMenu, common buttons)
  - [ ] `saves.json` (SaveLoadModal)
  - [ ] `devMode.json` (DevModeDrawer)
  - [ ] `errors.json` (ErrorBoundary)
- [ ] Update all UI components to use `useTranslation()`
- [ ] Export UI translations from `@react-text-game/ui/i18n`
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
- [ ] Test UI translation overrides
- [ ] Test passage translations
- [ ] Verify TypeScript types work correctly

---

## 12. Benefits of V1 (Simple Approach)

✅ **No CLI tooling needed** - uses standard i18next setup
✅ **Familiar to experienced developers** - standard react-i18next patterns
✅ **Full control** - users manage their translation files
✅ **Quick to implement** - mostly integration work, not code generation
✅ **Foundation for V2** - establishes i18n architecture for future automation
✅ **TypeScript support** - full type safety with i18next
✅ **Flexible** - users can use any i18next plugins or backends

---

## 13. Limitations (Addressed in V2)

⚠️ **Manual setup required** - users must create translation files themselves
⚠️ **Code duplication** - translation keys repeated in code and JSON
⚠️ **No auto-extraction** - strings must be manually copied to JSON
⚠️ **MDX not fully integrated** - requires workarounds or manual components
⚠️ **No watch mode** - users must manually keep translations in sync
⚠️ **No CLI helpers** - no scaffolding or validation tools

These will be addressed in **V2** with automatic code generation and CLI tooling.
