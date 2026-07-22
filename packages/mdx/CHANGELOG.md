# Changelog

All notable changes to `@react-text-game/mdx` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-22

### Added

- Public `ConversationProps` and `IncludeProps` types for custom authoring components

### Changed

- Consolidated component transformation into single-pass validation and construction paths
- Reused static action color and variant lookup sets and removed intermediate arrays in MDX structure processing
- Preserved source order, runtime callbacks, and generated story meaning while reducing transform allocations
