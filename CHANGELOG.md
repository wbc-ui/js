# Changelog

All notable changes follow Keep a Changelog. This package uses semantic versioning.

## 3.0.0-rc.3

### Changed

- Coordinated WBC v3 release-candidate alignment and refreshed public documentation.

## 3.0.0-rc.2

### Changed

- Version bump for coordinated WBC v3 release candidate (npm `next`).

## 3.0.0-rc.1

### Added

- Vue 3 `WBGC` runtime and `createView()` wrapper.
- `_*.js` view-folder assembly through `assembleViewData()`.
- Typed `JSAccessibility`, `WBGCViewData`, props, watchers, and install options.
- `wbjs-create-view` CLI with safe overwrite and opt-in route registration.
- Optional host-neutral language, authentication, and service adapters.
- Chromium integration and accessibility smoke suite.

### Changed

- `loaderDive` is now the application default; explicit `viewComps.jsDive` wins.
- Installation failures throw instead of leaving a partially installed application.
- The development inspector no longer requires Vuex/Pinia propagation state.

### Security

- Remote view descriptions are documented as untrusted data. Executable functions and actions
  must remain in a client-owned allowlist.
