const router = require('koa-router')();
const { getUserList } = require('../service/user.service');

router.prefix('/u');

router.get('/', async (ctx) => {
  ctx.body = await getUserList();
});

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
