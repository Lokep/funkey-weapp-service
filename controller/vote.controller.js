const { COMMON_ERR } = require('../constants/status-code');
const {
  getVoteRecordsByDateAndOpenId,
  getVoteRecordsByDate,
  getDistinctVoteRecordsByOpenId,
  vote,
  getCreator,
} = require('../service/vote.service');

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

/**
 * 发起投票
 */
router.post('/set-up-vote', (ctx) => {
  const { openId } = ctx.request.body;

  getCreator(openId);

  ctx.body = {
    res: 0,
  };
});

// 投票
router.post('/vote', async (ctx) => {
  const { openId, shopId } = ctx.query.body;

  try {
    await vote({ openId, shopId });
    const list = await getVoteRecordsByDate();
    ctx.body = {
      res: 0,
      data: list,
    };
  } catch (err) {
    ctx.body = {
      res: COMMON_ERR,
      msg: err,
    };
  }
});

/**
 * 投票详情
 */
router.get('/detail', async (ctx) => {
  const { date, openId } = ctx.query;
  try {
    const info = await getVoteRecordsByDateAndOpenId(openId, date);
    const list = await getVoteRecordsByDate(date);
    ctx.body = {
      res: 0,
      data: {
        info,
        list,
      },
    };
  } catch (error) {
    ctx.body = {
      res: COMMON_ERR,
      msg: error,
    };
  }
});

// 投票记录
router.get('/vote-records', async (ctx) => {
  const { openId } = ctx.query;

  try {
    const list = await getDistinctVoteRecordsByOpenId(openId);

    ctx.body = {
      res: 0,
      data: list,
    };
  } catch (err) {
    ctx.body = {
      res: COMMON_ERR,
      msg: err,
    };
  }
});

module.exports = router;
