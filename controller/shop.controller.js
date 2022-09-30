const { COMMON_ERR } = require('../constants/status-code');
const {
  getPersonalBlackMenuList,
  addPersonalBlackMenuRecord,
  updatePersonalBlackMenuRecord,
  getClearShopList,
} = require('../service/shop.service');

const router = require('koa-router')();

/**
 * - 店铺增删改查
 * - 店铺排行榜
 * - 店铺黑名单
 */
router.prefix('/shop');

/**
 * 根据count字段获取店铺列表
 * 可用于首页展示
 * 也可以用于排行榜展示
 */
router.get('/list', async (ctx) => {
  const { openId } = ctx.query;
  try {
    const clearList = await getClearShopList(openId);

    ctx.body = {
      res: 0,
      data: clearList || [],
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      data: [],
      msg: error,
    };
  }
});

// 获取个人店铺黑名单
router.get('/personal-black-menu-list', async (ctx) => {
  const { openId } = ctx.query;

  try {
    const list = await getPersonalBlackMenuList(openId);

    ctx.body = {
      res: 0,
      data: list || [],
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      data: [],
      msg: error,
    };
  }
});

router.post('/add-personal-black-menu', async (ctx) => {
  const { openId, shopId } = ctx.request.body;

  try {
    await addPersonalBlackMenuRecord({ openId, shopId });

    ctx.body = {
      res: 0,
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      msg: error,
    };
  }
});

router.post('/delete-personal-black-menu', async (ctx) => {
  const { openId, shopId } = ctx.request.body;
  try {
    await updatePersonalBlackMenuRecord({ openId, shopId, isDelete: 0 });

    ctx.body = {
      res: 0,
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      msg: error,
    };
  }
});

module.exports = router;
