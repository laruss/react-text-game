# Changelog

All notable changes to `@react-text-game/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.17] - 2026-01-24

### Changed

- `GameProvider` now passes `MainMenu` component directly to `newWidget` instead of calling it as a function, aligning with core package widget changes
- `HotspotMenu` now centers menu items with `justify-center items-center` classes
- `HotspotMenuItem` button now has full width (`w-full`) for consistent menu item sizing
- `Conversation` component now applies custom `backgroundColor` to the content bubble instead of the container
- Moved `i18next` and `react-i18next` from dependencies to peerDependencies for better dependency management

### Fixed

- Removed duplicate `border-border` class from Conversation left-side bubble styles

## [0.3.16] - 2026-01-23

### Fixed

- `CurrentPassageData` component in DevModeDrawer now uses `getLastDisplayResult()` instead of calling `display()` directly, preventing unintended side effects when inspecting passage data in development mode
