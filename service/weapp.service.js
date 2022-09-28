const { default: axios } = require('axios');
const appMap = require('../config/weapp.config');
const { COMMON_ERR } = require('../constants/status-code');
const db = require('../utils/db');

async function login(code) {
  const res = await getJscode2session(code);

  if (res.openid) {
    /**
     * 查找用户
     */
    const isExit = await findUserByOpenId(res.openid);

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
      return list.length > 0;
    })
    .catch(() => false);
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
}) {
  console.log(`
  INSERT INTO tmp_user
  ('open_id, 'union_id', 'avatar_url', 'gender', 'language', 'nick_name')
  VALUES
  ('${openId}', '${unionId}', '${avatarUrl}', ${gender}, '${language}', '${nickName}');
`);
  return db
    .query(
      `
      INSERT INTO tmp_user
      (open_id, union_id, avatar_url, gender, language, nick_name)
      VALUES
      ('${openId}', '${unionId}', '${avatarUrl}', ${gender}, '${language}', '${nickName}');
  `,
    )
    .then((list = []) => {
      return list.length > 0;
    })
    .catch(() => false);
}

/**
 * 生成token
 */
function generateToken() {}

module.exports = {
  login,

  generateToken,
};
