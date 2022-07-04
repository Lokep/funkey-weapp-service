const dayjs = require('dayjs');
const {
  getBannerList,
  addBanner,
  updateBanner,
  deleteBannerById,
} = require('../service/banner.service');

const router = require('koa-router')();

router.prefix('/banner');

router.get('/list', async (ctx) => {
  ctx.body = await getBannerList(ctx.query);
});

router.post('/add', async (ctx) => {
  const { onlineTimeEnd, onlineTimeStart } = ctx.request.body;

  const res = await addBanner({
    ...ctx.request.body,
    onlineTimeStart: dayjs(onlineTimeStart).format('YYYY/MM/DD hh:mm:ss'),
    onlineTimeEnd: dayjs(onlineTimeEnd).format('YYYY/MM/DD hh:mm:ss'),
  });

  ctx.body = res;
});

router.post('/update', async (ctx) => {
  const res = await updateBanner({
    ...ctx.request.body,
  });

  ctx.body = res;
});

router.delete('/:id', async (ctx) => {
  const { id } = ctx.params;

  ctx.body = await deleteBannerById({ id });
});

module.exports = router;
