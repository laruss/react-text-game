# Changelog

All notable changes to `@react-text-game/core` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.17] - 2026-01-24

### Added

- `AudioTrack.cancelFade()` method to cancel any ongoing fade animation
- `AudioTrack.originalVolume` property to store the configured volume for reliable fadeIn targeting

### Changed

- **Breaking:** `WidgetContent` type now accepts `ReactNode | React.FC` instead of `ReactNode | (() => ReactNode)`. Function content is always treated as a React component and rendered via `createElement`, ensuring hooks work correctly in minified production builds where function names are mangled
- `Widget.display()` now uses `createElement` for function content instead of calling it directly
- `AudioTrack.fadeIn()` now cancels any ongoing fade before starting and uses original volume as target when current volume is 0
- `AudioTrack.fadeOut()` now cancels any ongoing fade before starting
- `AudioTrack.dispose()` now cancels any ongoing fade animation

### Fixed

- Fixed `AudioTrack.fadeIn()` failing when called after a previous fade left volume at 0 by falling back to original configured volume

## [0.5.16] - 2026-01-23

### Added

- Added `_lastDisplayResult` protected property to `Passage` base class for caching display results
- Added `getLastDisplayResult<T>()` method to retrieve cached display result without re-executing content functions
- Added `hasDisplayCache()` method to check if a cached display result exists
- Story, Widget, and InteractiveMap passages now automatically cache their display results after each `display()` call

### Changed

- Passage `display()` method now stores the result in cache before returning
