# Type Alias: VersionSource

> **VersionSource** = `"--game-version"` \| `"entry export"` \| `"package.json"` \| `"engine default"`

Defined in: [loadEntry.ts:34](https://github.com/laruss/react-text-game/blob/fe357d1c2eb420359700f4e6a85ba5017204954d/packages/devtools/src/loadEntry.ts#L34)

Where the game version in a capture came from.

## Remarks

Worth surfacing, because the whole "you changed the shape but not the version"
check is only as trustworthy as this.

The engine's configured version is normally out of reach: games pass it to
`Game.init()` from their React entry point, which imports stylesheets and
components and so cannot be loaded here. Hence the fallback chain, in
decreasing order of trustworthiness:

1. `"--game-version"` - an explicit value from the command line
2. `"entry export"` - a `gameVersion` string exported by the entry module
3. `"package.json"` - the version in the nearest manifest
4. `"engine default"` - whatever the engine holds, usually just its default
