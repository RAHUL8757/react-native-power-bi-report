# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-10-04

### Added
- PropTypes validation for runtime type checking
- Comprehensive error handling in embedded report
- Props documentation table in README
- LICENSE file (MIT)
- .npmignore and .gitignore files
- CHANGELOG.md for version tracking

### Changed
- **BREAKING**: Updated peer dependencies to support wider version ranges
  - React: `>=16.8.0` (previously `18.3.1`)
  - React Native: `>=0.60.0` (previously `^0.79.0`)
  - react-native-webview: `>=11.0.0` (previously `^13.10.2`)
- Optimized configuration generation with useMemo
- Improved merge function with array handling
- Enhanced HTML template with better error handling
- Updated README with accurate dependency information

### Fixed
- Missing logoUrl dependency in getTemplate memoization
- Potential null reference errors in iframe access
- Array handling in configuration merge function

## [1.1.1] - Previous Release

### Features
- Power BI report embedding
- Custom logo support
- Language localization
- Scroll control
- Custom height configuration
- Mobile-optimized layout
