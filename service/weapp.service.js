const { default: axios } = require('axios');
const { v4: uuidv4 } = require('uuid');

const appMap = require('../config/weapp.config');
const { COMMON_ERR } = require('../constants/status-code');
const db = require('../utils/db');

async function login(code) {
  const res = await getJscode2session(code);

  if (res.openid) {
    /**
     * 查找用户
     */
    const list = await findUserByOpenId(res.openid);
    const isExit = list.length > 0;

    if (!isExit) {
      addUser({ openId: res.openid });
    }
  }

  /**
   * token
   */

  return res;
}

/**
 * 获取openId
 * @param {String} code
 * @returns
 */
function getJscode2session(code = '') {
  if (!code) {
    return {
      message: 'code不存在',
      res: COMMON_ERR,
    };
  }

  return axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    method: 'get',
    params: {
      appid: appMap.get('appid'),
      secret: appMap.get('secret'),
      js_code: code,
      grant_type: 'authorization_code',
    },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
}

/**
 * 通过openId查找用户
 * @param {String} openId
 * @returns
 */
function findUserByOpenId(openId) {
  return db
    .query(
      `
    select * from tmp_user where open_id = '${openId}'
  `,
    )
    .then((list = []) => {
      return list.length;
    })
    .catch(() => []);
}

/**
 * 添加用户
 * @returns
 */
function addUser({
  openId = '',
  unionId = '',
  avatarUrl = '',
  gender = 0,
  language = 'chinese',
  nickName = '',
  email = '',
  notify = 0,
}) {
  return db
    .query(
      `
      INSERT INTO tmp_user
      (open_id, union_id, avatar_url, gender, language, nick_name)
      VALUES
      ('${openId}', '${unionId}', '${avatarUrl}', ${gender}, '${language}', '${nickName}','${email}', ${notify});
  `,
    )
    .then((list = []) => {
      return list.length > 0;
    })
    .catch(() => false);
}

/**
 * 更新用户信息
 */
async function updateUser({
  openId = '',
  unionId = '',
  avatarUrl = '',
  gender = 0,
  language = 'chinese',
  nickName = '',
  email = '',
  notify = 0,
}) {
  const user = await findUserByOpenId(openId);

  const row = {
    ...user,
    unionId: unionId || user.union_id,
    avatarUrl: avatarUrl || user.avatar_url,
    gender,
    language,
    nickName: nickName || user.nick_name,
    email,
    notify,
  };

  return db.query(`
    UPDATE tmp_user
    SET 'union_id' = '${row.unionId}', 'avatar_url' = '${row.avatarUrl}', 'gender' = ${row.gender}, 'language' = '${row.language}', 'nick_name' = '${row.nickName}', 'email' = '${row.email}', 'notify' = ${row.notify}
    WHERE 'open_id' = '${openId}';
  `);
}

/**
 * 生成token
 */
function generateToken() {
  const token = uuidv4();
  return token;
}

module.exports = {
  login,
  generateToken,
  updateUser,
};
