const REDIS_CONF = require("../config/redis.config");
/* redis 配置
  REDIS_CONF = {
    host: '127.0.0.1',
    port: '6379',
    pwd:'123456'
}
*/

//创建客户端
const Redis = require("ioredis");
// const redis=new Redis({
//    host : '127.0.0.1',//安装好的redis服务器地址
//    port : 80,　//端口
//    prefix : 'sam:',//存诸前缀
//    password: 'auth',
//    ttl : 60 * 60 * 23,//过期时间
//    db: 0
// });
const redisClient = new Redis({
  host: REDIS_CONF.host,
  port: REDIS_CONF.port,
  password: REDIS_CONF.pwd,
});

redisClient.on("error", (err) => {
  console.log(err);
});

redisClient.on("ready", (res) => {
  console.log("redis启动成功", res);
});

/**
 * 设置 key
 * @param {String} key 
 * @param {any} val 
 * @param {Number} time 单位秒
 * @returns 
 */
function set(key, val, time) {
  if (typeof val === "object") {
    val = val;
  }
  return redisClient.set(key, val, function (err, data) {
    if (!err && time) {
      // key   时间
      redisClient.expire(key, time, function (err1, data1) {
        console.log(data1);
      });
    }
  });
}

function get(key) {
  return redisClient.get(key, function (err, doc) {
    return doc;
  });
}

// function delete(key){
//     return redisClient.getdel
// }

module.exports = {
  set,
  get,
};
