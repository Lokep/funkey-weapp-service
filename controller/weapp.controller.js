const router = require('koa-router')();
const { COMMON_ERR } = require('../constants/status-code');
const { getUserList } = require('../service/user.service');
const { login, updateUser, findUserByOpenId } = require('../service/weapp.service');

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
    const info = await login(code);

    const [user] = await findUserByOpenId(info.openid);
    ctx.body = {
      res: 0,
      data: { ...info, ...user },
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      msg: error,
    };
  }
});

router.post('/update-user-info', async (ctx) => {
  const userInfo = ctx.request.body;

  try {
    await updateUser(userInfo);

    ctx.body = {
      res: 0,
      data: userInfo,
    };
  } catch (err) {
    console.log(err);
    ctx.body = {
      res: COMMON_ERR,
      msg: err,
    };
  }
});

router.get('/friends', async (ctx) => {
  try {
    const list = await getUserList();
    ctx.body = {
      res: 0,
      data: list,
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      msg: error,
    };
  }
});

module.exports = router;
