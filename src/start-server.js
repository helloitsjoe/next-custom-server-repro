const { createServer } = require("http");
const next = require("next");
const express = require("express");
const { getStore, run } = require("./async-store");

console.log("start-server pid", process.pid);

const app = express();

const dev = process.env.NODE_ENV !== "production";
const setCustomServerFalse = process.env.SET_CUSTOM_SERVER_FALSE === "true";

console.log("setCustomServerFalse", setCustomServerFalse);

const nextApp = next({
  dev,
  // If customServer is not explicitly set to false, don't include it at all
  ...(setCustomServerFalse ? { customServer: false } : null),
});
const handle = nextApp.getRequestHandler();

// Middleware to set up AsyncLocalStorage for passing context around
app.use((req, res, next) => {
  const store = getStore();
  // Create a context for the request.
  // `run()` sets the AsyncLocalStorage instance's `enabled` to true
  run(new Map(), next);
});

// Middleware to set up res.locals for passing context around
app.use((req, res, next) => {
  res.locals.foo = "bar";
  next();
});

nextApp.prepare().then(() => {
  console.log("NextApp is ready");
});

app.get("*", handle);

createServer(app).listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
