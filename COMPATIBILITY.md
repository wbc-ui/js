# Compatibility

| Surface | Supported contract |
|---|---|
| Vue | `^3.5.0` |
| `@wbc-ui/core` | `^3.0.0-rc.3` for this prerelease line |
| Modules | ESM and CommonJS library consumers |
| Bundlers | Vite 6; other Vue 3 bundlers may use explicit `viewData` |
| Browsers | Current Chromium and Firefox release lines (automated); Safari requires application-level validation |
| Node | 20 or newer for the CLI and build tooling |
| TypeScript | Bundler-style module resolution; declarations ship in the package |

`import.meta.glob` is a Vite build-time feature. Non-Vite consumers can assemble modules
themselves or pass an explicit `viewData` object.

Vue Router, a store, date utilities, cookies, authentication, and validators are optional.
Provide them through the host application or the `context` adapters.
