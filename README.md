# @wbc-ui/js

JavaScript utilities, plugin system, and tracking infrastructure for WBC UI3 applications. This package provides `WBGC`, the core view-loader component that resolves `_*.js` folder conventions into executable WBC trees.

Documentation and live cases: [wbjs.net](https://wbjs.net).

Release references: [compatibility](./COMPATIBILITY.md) · [migration](./MIGRATION.md) ·
[changelog](./CHANGELOG.md)

## Installation

```bash
npm install @wbc-ui/js @wbc-ui/core
```

### Requirements

- **Vue 3.5+** — Peer dependency for the ecosystem.
- **@wbc-ui/core** — Peer dependency. Supplies the intrinsic `<WBC>` rendering engine and global helper functions.

## Usage

### Plugin install

Installing `@wbc-ui/js` automatically registers both `WBGC` (the loader) and `WBC` (the intrinsic rendering engine from core).

```js
import { createApp } from 'vue';
import wbjs from '@wbc-ui/js';
import App from './App.vue';

const app = createApp(App);
app.use(wbjs);
app.mount('#app');
```

Host integrations are optional and explicit:

```js
app.use(wbjs, {
  context: {
    language: {
      get: () => i18n.global.locale.value,
      set: (language) => { i18n.global.locale.value = language; },
    },
    auth: {
      user: () => session.user,
      loggedIn: () => session.authenticated,
      userTier: () => session.plan,
    },
  },
});
```

### Component Mount

In your template, render the loader using the `<WBGC>` component, providing the resolved view modules:

```vue
<script setup>
// Use the eager folder convention to load all view files
const modules = import.meta.glob('./**/_*.js', { eager: true });
</script>

<template>
  <WBGC :modules="modules" />
</template>
```

### Helper APIs

You can also use the standalone helper methods exported by the package to programmatically resolve and structure views:

- `assembleViewData(modules)`: Given a dictionary of module imports (e.g. from `import.meta.glob`), merges them into a single `viewData` definition.
- `createView(options)`: Returns a Vue wrapper component that renders `WBGC`.

### TypeScript

The package publishes declarations for `WBGC`, `WBGCViewData`, `JSAccessibility`, the
plugin options, watchers, and all helper exports. Types are discovered automatically:

```ts
import type { JSAccessibility, WBGCViewData } from '@wbc-ui/js';

type DashboardState = { loading: boolean; rows: unknown[] };
const view: WBGCViewData<DashboardState> = {
  data: () => ({ loading: false, rows: [] }),
  init: (ctx: JSAccessibility<DashboardState>) => { ctx._s.loading = true; },
};
```

### Scaffold a view

```bash
npx wbjs-create-view src/views/Dashboard
npx wbjs-create-view src/views/Reports --register
```

The generator creates the complete ESM `_*.js` convention without overwriting existing
files unless `--force` is supplied. `--register` only edits a router containing the explicit
`// wb-views:routes` marker.

## View Lifecycle

WBGC manages a specific lifecycle for loaded view modules, triggering lifecycle hooks sourced from their respective files via the glob merger (e.g., `_init0.js`, `_init.js`, `_tracker.js`, and `_finalAction.js`):

1. **`init0`**: Called during the component's `created()` hook.
2. **`init`**: Called when the component is mounted to the DOM (`mounted()`).
3. **`tracker`**: Fired only on every `updated()` hook cycle to execute tracking logic.
4. **`finalAction`**: Called just before the view unmounts (`beforeUnmount()`).
5. **`watchers`**: Registered in `created()`. The `watchers` array should contain tuples of `[source, handler, ...options]` which are each registered securely against the component's state via `$watch`.

## `_this` surface table

WBGC binds a dynamic programming surface (called `jsAccessibility`) which is passed to evaluation functions in your view blocks. Each key is prefixed with `_` to align with view file naming conventions.

| Key | Description |
|---|---|
| `_this._store` | The application Vuex/Pinia store instance |
| `_this._router` | The application router |
| `_this._routes` | Record of route definitions by name |
| `_this._route` | The current route object |
| `_this._routeParams` | Current route parameters |
| `_this._lg` | Language interface (`lang`, `get()`, `set(lang)`) |
| `_this._user` | Logged-in user state (`store.state.user`) |
| `_this._loggedIn` | Boolean authentication status |
| `_this._userTier` | Current user tier (defaults to 'free') |
| `_this._props` | Component props |
| `_this._data` | The resolved VIEW tree (`viewComps`) |
| `_this._state` | Reactive view-local state (`viewState`) |
| `_this._s` | Alias for `_state` |
| `_this._methods` | View-local helper functions |
| `_this._meta` | Route and view meta options |
| `_this._proto` | Object prototype of the WBGC instance |
| `_this._vm` | The Vue component instance itself |
| `_this._el` | The root DOM element (`$el`) |
| `_this._ref` | Function returning `refs.reference` |
| `_this._refs` | The component's `$refs` |
| `_this._cookies` | Exposes `js-cookie` (or injected `$cookies`) |
| `_this._moment` | Date manipulation helper (typically aliases Day.js) |
| `_this._dayjs` | Exposes `$dayjs` |
| `_this._queryData` | Data query execution function |
| `_this._aes` | AES `{ enc, dec }` encryption/decryption helpers |
| `_this._validators` | host-supplied form/field validators (`self.validators || {}`) |
| `_this._watch` | Vue `$watch` exposed programmatically |
| `_this._update` | Forces a re-render by incrementing the component's internal key |
| `_this._emit` | Emits custom events to the parent via `$emit` |
| `_this._alert` | Internal logging/alert helper |
| `_this._trigger` | Invokes a specified method by name |
| `_this._go` | Helper for router navigation (`_go(path)`) |

## Alt/Shift-Click Inspector

WBGC ships with a built-in context inspector tool for development.

- **Trigger:** `Alt + Right-Click` on a WBGC-rendered view in the browser.
- **Action:** Triggers a dashed border outline, assigns a randomized background for bounding-box visualization, and emits the underlying component structure directly to the global scope (`_el`, `_parent0`, `_parent1`, and an array `_els`).
- **Clear:** `Shift + Right-Click` clears the borders and removes the exposed globals.
- **Safety:** This inspector is explicitly gated behind `__WBC_DEV__` and compiles out completely in production builds.

## License

MIT © [Wissem Boughamoura](https://github.com/wissemb11)
