const { createServer } = require('http');
const next = require('next');
const express = require('express');
const { getStore, run } = require('./async-store');

const app = express();

const dev = process.env.NODE_ENV !== 'production';
const customServer = process.env.CUSTOM_SERVER === 'true';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// AsyncStore middleware
app.use((req, res, next) => {
  const store = getStore();
  run(new Map(), next);
});

// res.locals middleware
app.use((req, res, next) => {
  res.locals.foo = 'bar';
  console.log('START-SERVER res.locals.foo', res.locals.foo);
  next();
});

nextApp.prepare().then(() => {
  console.log('NextApp is ready');
});

app.get('*', handle);

createServer(app).listen(3000, () => {
  console.log('listening on port 3000');
});
