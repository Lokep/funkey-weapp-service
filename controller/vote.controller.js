const router = require('koa-router')();

/**
 * - 投票详情
 * - 投票记录
 *
 *
 * 每天上午第一个点击发起投票的，会在redis中写入该用户的open_id，作为creator_id使用
 * 每一个用户参与投票的，都会在vote表新增一条记录
 *
 * 投票结束之后，在shop表更新「选择次数(count)」字段
 * 之所以需要去做更新，是为了做店铺排行榜的时候，更方便
 */
router.prefix('/vote');

router.get('/', (ctx) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx) => {
  ctx.body = 'this is a users/bar response';
});

module.exports = router;
