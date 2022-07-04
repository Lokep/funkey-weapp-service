const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
// const cors = require('koa2-cors');

const weapp = require('./controller/weapp.controller');
const user = require('./controller/user.controller');
const movie = require('./controller/movie.controller');
const banner = require('./controller/banner.controller');
const article = require('./controller/article.controller');

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
// app.use(require("koa-static")(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

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

// app.use(
//   cors({
//     origin() {
//       // 设置允许来自指定域名请求
//       return '*'; // 只允许http://localhost:8080这个域名的请求
//     },
//     maxAge: 5, // 指定本次预检请求的有效期，单位为秒。
//     credentials: true, // 是否允许发送Cookie
//     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的HTTP请求方法
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 设置服务器支持的所有头信息字段
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'], // 设置获取其他自定义字段
//   }),
// );

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

module.exports = app;
