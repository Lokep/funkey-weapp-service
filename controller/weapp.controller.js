const router = require('koa-router')();
const redis = require('../utils/redis');

router.prefix('/weapp');

router.get('/', (ctx) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response';
  redis.set('name', 'redis', 60);
});

module.exports = router;
