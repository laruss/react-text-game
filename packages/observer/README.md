# @react-text-game/observer

Developer tools for managing, visualizing, and analyzing passages in React Text Game projects.

## Overview

The Observer package provides a comprehensive suite of tools to help developers build text-based games with the React Text Game framework. It automatically discovers passages in your codebase, tracks their relationships, and provides visual tools for navigation and debugging.

## Features

### Currently Implemented

- **Passage Discovery** - Automatically scan TypeScript and MDX files for game passages
- **Metadata Management** - Store and manage passage metadata (tags, descriptions, positions)
- **Connection Tracking** - Detect `Game.jumpTo()` calls to map passage relationships
- **CLI Tools** - Initialize projects and scan for passages via command line
- **HTTP API** - RESTful API for reading and updating passage data
- **Visual Editor** - React-based interface for viewing passage graphs (in development)

### Supported Passage Types

- `newStory()` - Text-based narrative passages
- `newInteractiveMap()` - Image-based interactive passages with hotspots
- `newWidget()` - Custom React component passages

## Installation

```bash
bun add -D @react-text-game/observer
```

Or install globally for CLI access:

```bash
bun add -g @react-text-game/observer
```

## Quick Start

### 1. Initialize Observer in Your Project

```bash
rtg-observer init
```

This creates the `.react-text-game` directory structure:

```
.react-text-game/
├── config.json          # Configuration for passage scanning
└── metadata/
    └── passages.json    # Passage metadata and connections
```

### 2. Scan Your Project

```bash
rtg-observer scan
```

This scans your source files and:
- Finds all passage factory calls (`newStory`, `newInteractiveMap`, `newWidget`)
- Detects passage connections via `Game.jumpTo()` calls
- Updates `passages.json` with metadata
- Identifies the start passage from `Game.init()` or `GameProvider`

### 3. Start the Visual Editor Server

```bash
rtg-observer start
```

The server starts at `http://localhost:4000` (configurable with `--port`).

Access the API at:
- `GET /api/passages` - Get all passages, connections, and settings
- `PATCH /api/passages/:id/position` - Update passage position

## CLI Reference

### `rtg-observer init`

Initialize Game Observer in the current project.

**Options:**
- `-d, --dir <path>` - Root directory for initialization (default: current directory)
- `-f, --force` - Overwrite existing files

**Example:**
```bash
rtg-observer init --dir ./my-game --force
```

### `rtg-observer scan`

Scan the project for passages and update metadata.

**Options:**
- `-d, --dir <path>` - Root directory to scan (default: current directory)

**Example:**
```bash
rtg-observer scan --dir ./my-game
```

**Output:**
```
Scanning project for passages...

✓ Scan completed successfully

Found: 12 passages
Added: 3 new passages
Updated: 8 existing passages
Removed: 1 deleted passages
```

### `rtg-observer start`

Start the Game Observer server for visual editing and API access.

**Options:**
- `-p, --port <port>` - Port to run the server on (default: 4000)

**Example:**
```bash
rtg-observer start --port 3000
```

## Configuration

### config.json

Located at `.react-text-game/config.json`, this file controls passage scanning behavior:

```json
{
  "passageDirectories": ["src/passages", "src/game"],
  "excludePatterns": [
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/node_modules/**"
  ]
}
```

**Fields:**
- `passageDirectories` - Directories to scan for passages (default: `["src"]`)
- `excludePatterns` - Glob patterns to exclude from scanning

### passages.json

Located at `.react-text-game/metadata/passages.json`, this file stores passage metadata:

```json
{
  "passages": {
    "intro": {
      "id": "intro",
      "source": "code",
      "tags": ["prologue"],
      "description": "Opening scene",
      "position": { "x": 100, "y": 100 }
    },
    "village": {
      "id": "village",
      "source": "tool",
      "position": { "x": 300, "y": 100 }
    }
  },
  "connections": [
    { "from": "intro", "to": "village" },
    { "from": "village", "to": "forest" }
  ],
  "settings": {
    "startPassage": "intro"
  }
}
```

**Passage Metadata Fields:**
- `id` (string, required) - Unique passage identifier
- `source` (string, required) - `"code"` for user-created (read-only in UI), `"tool"` for tool-created (editable in UI)
- `tags` (string[], optional) - User-defined categories/tags
- `description` (string, optional) - Passage description
- `position` (object, optional) - Visual editor position `{ x: number, y: number }`
- `customMetadata` (object, optional) - Extensible metadata object

**Connection Fields:**
- `from` (string) - Source passage ID (or `"_CODE"` if called outside passages)
- `to` (string) - Target passage ID

**Settings Fields:**
- `startPassage` (string) - Initial passage ID configured in `Game.init()` or `GameProvider`

## API Reference

### GET /api/passages

Get all passages, connections, and settings.

**Response:**
```json
{
  "passages": { /* ... */ },
  "connections": [ /* ... */ ],
  "settings": { "startPassage": "intro" }
}
```

### PATCH /api/passages/:id/position

Update a passage's position in the visual editor.

**Request Body:**
```json
{
  "x": 250,
  "y": 150
}
```

**Response:**
```json
{
  "success": true,
  "passage": {
    "id": "intro",
    "source": "code",
    "position": { "x": 250, "y": 150 }
  }
}
```

## How It Works

### Passage Detection

The scanner uses TypeScript AST parsing to find passage factory calls:

```typescript
// These are automatically detected:
const intro = newStory('intro', () => [/* ... */]);
const map = newInteractiveMap('village-map', /* ... */);
const inventory = newWidget('inventory', /* ... */);
```

### Connection Detection

Connections are extracted from `Game.jumpTo()` calls:

```typescript
// This creates a connection from current passage to 'village'
Game.jumpTo('village');

// In action callbacks:
{
  label: 'Continue',
  action: () => Game.jumpTo('forest')  // Detected automatically
}
```

### Start Passage Detection

The scanner looks for:

1. **Game.init() calls:**
```typescript
Game.init({ startPassage: 'intro' });
```

2. **GameProvider options:**
```jsx
<GameProvider options={{ startPassage: 'intro' }}>
  {/* ... */}
</GameProvider>
```

If no start passage is found, it defaults to `"start-passage"` and creates a placeholder passage with `source: "tool"`.

### Source Attribution

Passages have a `source` field that determines their editability:

- **`"code"`** - Created in TypeScript/MDX source files
  - Read-only in visual tools
  - Metadata (tags, description, position) is editable
  - Core data (id, type) cannot be changed in UI

- **`"tool"`** - Created by Observer tools
  - Fully editable in UI
  - Can be modified or deleted through visual tools
  - Useful for placeholder passages

## Development

### Building

```bash
# Development mode (watch)
bun run dev

# Production build
bun run build

# Start server
bun run start
```

### Project Structure

```
packages/observer/
├── src/
│   ├── cli/
│   │   ├── actions/
│   │   │   ├── initialize.ts      # Init command logic
│   │   │   ├── scanPassages.ts    # Scan command logic
│   │   │   └── utils.ts           # Shared utilities
│   │   ├── commands/
│   │   │   ├── init.ts            # Init command
│   │   │   ├── scan.ts            # Scan command
│   │   │   └── start.ts           # Start command
│   │   ├── index.ts               # CLI entry point
│   │   └── program.ts             # Commander setup
│   ├── helpers/
│   │   └── validatePassages.ts    # Metadata validation
│   ├── routes/
│   │   └── passages.ts            # API endpoints
│   ├── consts.ts                  # Constants
│   ├── paths.ts                   # Path utilities
│   ├── types.ts                   # TypeScript types
│   └── index.ts                   # Server entry point
├── frontend/                      # React visual editor (in development)
├── package.json
├── tsconfig.json
├── README.md
├── roadmap.md                     # Development roadmap
└── todo.md                        # Current tasks
```

## Roadmap

This package is under active development. See [roadmap.md](./roadmap.md) for detailed plans.

### Completed (Phase 1.1-1.2)
- Static passage scanner for TypeScript files
- Connection extraction from `Game.jumpTo()` calls
- Metadata management system
- CLI tools (init, scan, start)
- HTTP API for passage data

### In Progress
- React Flow visual editor
- MDX passage support
- Mermaid diagram generation

### Planned
- Variable tracking and migration detection
- Passage creation utilities
- Grouping and organization tools
- MCP (Model Context Protocol) integration for AI assistance

## Contributing

Contributions are welcome! Please check [roadmap.md](./roadmap.md) for planned features and open issues.

## License

MIT

## Links

- [Documentation](https://reacttextgame.dev/)
- [GitHub Repository](https://github.com/laruss/react-text-game)
- [React Text Game Core](https://www.npmjs.com/package/@react-text-game/core)

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/laruss/react-text-game/issues)
- Check the [documentation](https://reacttextgame.dev/)

---

**Version:** 0.1.0
**Status:** Alpha - Core functionality implemented, visual tools in development
