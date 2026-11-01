# Migration to wb-js 3

## Vue application registration

Replace Vue 2 plugin registration with Vue 3 application installation:

```js
const app = createApp(App);
app.use(wbjs, options);
```

## Render and component contracts

- Use Vue 3 flat VNode props and events.
- Pass `viewData`, `modules`, `viewParams`, and `loaderDive` directly to `WBGC`.
- Use `beforeUnmount` semantics for `_finalAction` cleanup.

## First-arrow resolution

`loaderDive` supplies the default when a view omits `viewComps.jsDive`. An explicit Boolean
on the view overrides that default.

## Host state

Legacy Vuex fields remain fallback-compatible, but new applications should provide explicit
`context.language`, `context.auth`, and `context.services` adapters. The inspector no longer
requires `store.state.propagation`.

## Scaffolding

Generate ESM view folders with `npx wbjs-create-view <target>`. Existing files are preserved
unless `--force` is explicitly supplied.

## Remote descriptions

Do not evaluate functions received through JSON. Map server action identifiers to trusted
client functions and validate component names and props before rendering.
