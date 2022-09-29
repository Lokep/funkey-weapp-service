const db = require('../utils/db');
const dayjs = require('dayjs');
const redis = require('../utils/redis');
const { getUserList } = require('./user.service');

function getCurrentDate() {
  return dayjs().format('YYYY-MM-DD');
}

function getCurrentDateTime() {
  return dayjs().format('YYYY-MM-DD hh:mm:ss');
}

function setCreator(openId) {
  const current = dayjs().hour();
  const timestamp = (24 - current) * 3600;
  redis.set('creator', { openId }, timestamp);
}

function getCreator(openId) {
  const creator = redis.get('creator');

  if (!creator) {
    setCreator(openId);
  }

  return creator || { openId };
}

/**
 * 查找当天的投票
 */
function getVoteRecordsByDate(date = '') {
  const currentDate = getCurrentDate();

  return db
    .query(
      `
    select * from tmp_vote where create_at = '${date || currentDate}'
  `,
    )
    .then((list = []) => list);
}

function getVoteRecordsByDateAndOpenId(openId, date = '') {
  const currentDate = getCurrentDate();

  return db
    .query(
      `
    select * from tmp_vote where create_at = '${date || currentDate}' and member_id = '${openId}'
  `,
    )
    .then((list = []) => list);
}

/**
 * 查找个人的投票记录
 */
function getDistinctVoteRecordsByOpenId(openId) {
  // 这个sql前面的*需要优化
  return db
    .query(
      `
  SELECT v.id, v.create_at, v.status, v.creator_id, v.vote_id, v.result_id, p.name AS vote_shop_name, p.logo AS vote_shop_logo, p2.name as result_shop_name, p2.logo as result_shop_logo  from tmp_vote v LEFT JOIN tmp_shop p on v.vote_id = p.id LEFT JOIN tmp_shop p2 on v.result_id = p2.id WHERE v.member_id = '${openId}'
  `,
    )
    .then((list = []) => list);
}

/**
 * 投票
 * 最后一个投票结束的时候，
 * shop表更新「选择次数(count)」字段
 * 更新当天记录里的result_id、status
 */
async function vote({ openId, shopId }) {
  const createAt = getCurrentDateTime();
  const address = '杭州市余杭区西溪八方城';

  const { openId: creatorId } = getCreator();
  const users = await getUserList();
  const votes = await getVoteRecordsByDateAndOpenId();

  // TODO 11点投票截止
  // 当状态为2时，需要批量修改同一天记录里的status
  const status = users.length - 1 > votes.length ? 1 : 2;

  if (status === 2) {
    updateVoteRecordByCreatorId({ ...getCreator(), status });
  }

  return db.query(`
  INSERT INTO tmp_vote ( 'create_at, address, creator_id, status, member_id, vote_id)
  VALUES
  ('${createAt}', '${address}', '${creatorId}', ${status}, '${openId}', '${shopId}');
  `);
}

/**
 * 更新投票记录
 * 可用来投票结束之后，进行批量修改状态和投票结果
 */
function updateVoteRecordByCreatorId({
  openId,
  shopId = '',
  status = 1,
  date = getCurrentDateTime(),
}) {
  return db.query(`
    UPDATE tmp_vote
    SET result_id = '${shopId}', status = ${status}
    WHERE creator_id = '${openId}' and create_at = '${date}'
  `);
}

/**
 * 找出某个人最喜欢的店铺
 * @param {string} openId
 * @returns
 */
async function findPersonalFavoriteStore(openId) {
  const list = await getDistinctVoteRecordsByOpenId(openId);
  const backupList = [];
  // https://blog.csdn.net/weixin_44937336/article/details/112632045

  if (list.length === 0) {
    return false;
  }

  list.forEach((item) => {
    const index = backupList.findIndex((el) => el.vote_id == item.vote_id);
    if (index > -1) {
      backupList[index].count += 1;
    } else {
      backupList.push({
        vote_id: item.vote_id,
        count: 1,
      });
    }
  });

  backupList.sort((a, b) => b.count - a.count);

  return backupList[0];
}

module.exports = {
  getCreator,
  setCreator,
  vote,
  updateVoteRecordByCreatorId,
  findPersonalFavoriteStore,
  getVoteRecordsByDate,
  getDistinctVoteRecordsByOpenId,
  getVoteRecordsByDateAndOpenId,
};
