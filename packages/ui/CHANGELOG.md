# Changelog

All notable changes to `@react-text-game/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.16] - 2026-01-23

### Fixed

- `CurrentPassageData` component in DevModeDrawer now uses `getLastDisplayResult()` instead of calling `display()` directly, preventing unintended side effects when inspecting passage data in development mode
