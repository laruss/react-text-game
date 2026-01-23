# Changelog

All notable changes to `@react-text-game/core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.16] - 2026-01-23

### Added

- Added `_lastDisplayResult` protected property to `Passage` base class for caching display results
- Added `getLastDisplayResult<T>()` method to retrieve cached display result without re-executing content functions
- Added `hasDisplayCache()` method to check if a cached display result exists
- Story, Widget, and InteractiveMap passages now automatically cache their display results after each `display()` call

### Changed

- Passage `display()` method now stores the result in cache before returning
