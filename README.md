# Custom server loses context starting in `next@13.4.3-canary.3`

## What seems to be the problem?

When running a custom server with NextJS starting in `next@13.4.3-canary.3`, we ran into a few unexpected behaviors:

1. **`res.locals` is undefined.** We rely on `res.locals` to pass context from the custom server to `getServerSideProps` in pages in the `pages` directory.
2. **`AsyncLocalStorage` does not work correctly.** When we tried using an `AsyncLocalStorage` store as an alternative to `res.locals`, the store instance is undefined when accessing it in `getServerSideProps`.

This _seems_ to be connected to https://github.com/vercel/next.js/pull/49805, and the workaround noted in [this comment](https://github.com/vercel/next.js/pull/49805#issuecomment-1557321794) worked for us (but also requires `__NEXT_PRIVATE_PREBUNDLED_REACT`, see below).

## How to reproduce

### `next({dev: true})` :x:

First, run `yarn dev`, which runs `next({dev: true})`. Navigate to `http://localhost:3000` (`app` directory). You should see undefined/disabled values in the UI and in the terminal logs.

Now navigate to `http://localhost:3000/about` (`pages`), and in the terminal you'll see the same thing, as well as `res.locals` being undefined.

One other thing that might be worth noting: `process.env.pid` in `async-store.js` is not always the same as `process.env.pid` in `start-server.js`. However, this is true for both the broken version and fixed version, so might be a red herring.

### `next({dev: true, customServer: false})` :white_check_mark: \*

Next, run `yarn dev:fixed`, which runs `next({dev: true, customServer: false})`, but also sets `__NEXT_PRIVATE_PREBUNDLED_REACT=next` (See below for notes on that env var).

Navigate to `http://localhost:3000/about` (`pages` directory), and you will see logs in the terminal for the `AsyncLocalStorage` store, `instance.enabled` and `res.locals`.

```
PAGES ABOUT res.locals [Object: null prototype] { foo: 'bar' }
PAGES ABOUT store Map(0) {}
PAGES ABOUT Async Store enabled true
```

#### `__NEXT_PRIVATE_PREBUNDLED_REACT=next`

Without this private env var, the app router does not work in dev, with the following error:

```bash
- error Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server.edge' is not defined by "exports" in /Users/joe/PROJECTS/next-custom-server-repro/node_modules/react-dom/package.json
at new NodeError (node:internal/errors:399:5)
at exportsNotFound (node:internal/modules/esm/resolve:261:10)
at packageExportsResolve (node:internal/modules/esm/resolve:591:9)
at resolveExports (node:internal/modules/cjs/loader:569:36)
```

### `next@13.4.2` :white_check_mark:

The `next-13-4-2` branch has `next@13.4.2` and no `customServer` in `next()`. If you switch to this branch and run `yarn && yarn dev` you should see both `http://localhost:3000` (`app` directory) and `http://localhost:3000/about` (`pages` directory) load fine, with the expected `res.locals` and `AsyncLocalStorage` store in the UI/logs.
