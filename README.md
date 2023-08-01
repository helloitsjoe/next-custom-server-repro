# Custom Server Reproduction

## What seems to be the problem?

When running a custom server with NextJS starting in `next@13.4.3-canary.3`, we ran into a few unexpected behaviors:

1. **`res.locals` is undefined.** We rely on `res.locals` to pass context from the custom server to `getServerSideProps` in pages in the `pages` directory.
2. **`AsyncLocalStorage` does not work correctly.** When creating a global store, the instance of the store is undefined, and `enabled` is false.

## How to reproduce

To start, run `yarn` and `yarn dev`. This will start running the custom server in `src/start-server.js`. By default, the `customServer` option to `next()` is `false`.

### `next({customServer: false})` - `pages` :white_check_mark: but no `app` :x:

Navigate to `http://localhost:3000/about` (`pages` directory), and you will see logs in the terminal for the `AsyncLocalStorage` store instance and `res.locals`.

```
ABOUT res.locals [Object: null prototype] { foo: 'bar' }
ABOUT store Map(0) {}
ABOUT AsyncLocalStorage AsyncLocalStorage {
  kResourceStore: Symbol(kResourceStore),
  enabled: true
}
```

Navigate to `http://localhost:3000` (`app` directory), and you will see the following error:

```bash
- error Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server.edge' is not defined by "exports" in /Users/joe/PROJECTS/next-custom-server-repro/node_modules/react-dom/package.json
    at new NodeError (node:internal/errors:399:5)
    at exportsNotFound (node:internal/modules/esm/resolve:261:10)
    at packageExportsResolve (node:internal/modules/esm/resolve:591:9)
    at resolveExports (node:internal/modules/cjs/loader:569:36)
```

### `next()` - `app` :white_check_mark: but no `pages` :x:

Next, run `yarn dev:custom`, which runs `next()` with `customServer: true`. Navigate to `http://localhost:3000` (`app` directory), and the page should load successfully.

Now navigate to `http://localhost:3000/about` (`pages`), and in the terminal you should see that the `AsyncLocalStorage` store instance and `res.locals` are both undefined:

```
ABOUT res.locals undefined
ABOUT store undefined
ABOUT AsyncLocalStorage AsyncLocalStorage {
  kResourceStore: Symbol(kResourceStore),
  enabled: false
}
```

### `next@13.4.2` - `app` :white_check_mark: but no `pages` :white_check_mark:

If you switch to the `next-13-4-2` branch, which has `next@13.4.2` and no `customServer` in `next()`, you should see both `http://localhost:3000` (`app` directory) and `http://localhost:3000/about` (`pages` directory) load fine, with the expected `res.locals` and `AsyncLocalStorage` store in the logs.
