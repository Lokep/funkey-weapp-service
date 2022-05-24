const router = require('koa-router')()
const { getUserList } = require('../service/user.service')

router.prefix('/u')

router.get('/', async (ctx, next) => {
  ctx.body = await getUserList()
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
