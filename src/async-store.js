const { AsyncLocalStorage } = require('async_hooks');

if (!globalThis.ASYNC_STORE) {
  console.log('Creating global store...');
  globalThis.ASYNC_STORE = new AsyncLocalStorage();
}

const run = (store, callback) => {
  globalThis.ASYNC_STORE.run(store, callback);
};

const getStore = () => ASYNC_STORE.getStore();

module.exports = { run, getStore };
