const { COMMON_ERR } = require('../constants/status-code');
const { getShopList } = require('../service/shop.service');

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
  try {
    const shopList = await getShopList();
    ctx.body = {
      res: 0,
      data: shopList,
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      data: [],
      msg: error,
    };
  }
});

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
