const Koa = require('koa');

const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const compress = require('koa-compress');
const { toHump } = require('./utils/to-hump');

// const cors = require('koa2-cors');

const weapp = require('./controller/weapp.controller');
const user = require('./controller/user.controller');
const movie = require('./controller/movie.controller');
const banner = require('./controller/banner.controller');
const article = require('./controller/article.controller');

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
  );
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200;
  } else {
    await next();
  }
});

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  }),
);

app.use(json());
app.use(logger());

app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(
  compress({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH,
  }),
);

app.use(toHump);

// routes
app.use(weapp.routes(), weapp.allowedMethods());
app.use(user.routes(), user.allowedMethods());
app.use(movie.routes(), movie.allowedMethods());
app.use(banner.routes(), banner.allowedMethods());
app.use(article.routes(), article.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
