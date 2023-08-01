const { AsyncLocalStorage } = require("async_hooks");

console.log("async-store pid", process.pid);

if (!globalThis.__ASYNC_STORE) {
  console.log("Creating global store...");
  globalThis.__ASYNC_STORE = new AsyncLocalStorage();
}

// Export access to global async store
const run = (store, callback) => {
  globalThis.__ASYNC_STORE.run(store, callback);
};

const getStore = () => globalThis.__ASYNC_STORE.getStore();

module.exports = { run, getStore };
