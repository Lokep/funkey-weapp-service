const REDIS_CONF = require('../config/redis.config');
const { isObject } = require('../utils/index');

// 创建客户端
const Redis = require('ioredis');

const redisClient = new Redis({
  host: REDIS_CONF.host,
  port: REDIS_CONF.port,
  password: REDIS_CONF.pwd,
});

redisClient.on('error', (err) => {
  console.log(err);
});

redisClient.on('ready', (res) => {
  console.log('redis启动成功', res);
});

/**
 * 设置 key
 * @param {String} key
 * @param {any} val
 * @param {Number} time 单位秒
 * @returns
 */
function set(key, val, time) {
  const content = isObject(val) ? JSON.stringify(val) : val;

  return redisClient.set(key, content, (err, data) => {
    if (!err && time) {
      // key   时间
      redisClient.expire(key, time, (err1, data1) => {
        console.log(err, err1, data1, data);
      });
    }
  });
}

function get(key) {
  return redisClient.get(key, (err, doc) => {
    try {
      const content = doc == null ? doc : JSON.parse(doc);

      return content;
    } catch (error) {
      return doc;
    }
  });
}

// function delete(key){
//     return redisClient.getdel
// }

module.exports = {
  set,
  get,
};
