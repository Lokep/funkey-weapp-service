const router = require('koa-router')();
const { login } = require('../service/weapp.service');

/**
 * 小程序controller
 * - 解析 wx.login 解析 code 获取openId、unionId
 * - 解析 wx.getUserProfile 获取头像昵称等信息
 * - 或者可以 解析一下 群聊数据
 * - 我的好友
 */

router.prefix('/weapp');

router.get('/', (ctx) => {
  // ctx.query
  ctx.body = 'this is a users response!';
});

router.post('/login', async (ctx) => {
  const { code } = ctx.request.body;

  try {
    ctx.body = await login(code);
  } catch (error) {
    console.log(error);
    ctx.body = error;
  }
});

module.exports = router;
