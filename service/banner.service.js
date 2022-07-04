const dayjs = require('dayjs');
const { jumpTypeMap, boolMap, bannerStatusMap } = require('../constants/banner');
const STATUS_CODE = require('../constants/status-code');
const { isTimeValid } = require('../utils');
const db = require('../utils/db');

/**
 * *Done
 * 新增Banner
 * @param {String} imgUrl
 * @param {Numer} jumpType              ** 0-无跳转 ** 1-小程序(内部) ** 2-H5 ** 3-文字弹窗 ** 4-小程序(外部)
 * @param {String} url                  ** 小程序页面地址或h5地址
 * @param {String} appid                ** jump_type为4的时候使用, 外部小程序appid
 * @param {String} isDelete             ** 是否删除，默认为0 ** 1-已删除 0-未删除
 * @param {String} isFrozen             ** 是否冻结  默认为0 ** 1-已冻结 0-未冻结
 * @param {Datetime} onlineTimeStart    ** 上线时间
 * @param {Datetime} onlineTimeEnd      ** 下线时间
 * @param {String} content              ** type = 3时，展示的文字内容
 * @param {String} position             ** 0 首页顶部，1 电影页顶部
 */
async function addBanner({
  imgUrl = null,
  jumpType = jumpTypeMap.get('silence'),
  url = null,
  appid = null,
  isDelete = boolMap.get('falsy'),
  isFrozen = boolMap.get('falsy'),
  onlineTimeStart = dayjs().format('YYYY/MM/DD HH:mm:ss'),
  onlineTimeEnd = dayjs().add(1, 'year').format('YYYY/MM/DD HH:mm:ss'),
  content = null,
  position = 0,
}) {
  const sql = `
    INSERT INTO banner (img_url, jump_type,url, appid, is_delete, is_frozen, online_time_start, online_time_end, content, position)
    VALUES(?,?,?,?,?,?,?,?,?,?)`;

  try {
    const res = await db.query(
      sql,
      [
        imgUrl,
        jumpType,
        url,
        appid,
        isDelete,
        isFrozen,
        dayjs(onlineTimeStart).format('YYYY/MM/DD hh:mm:ss'),
        dayjs(onlineTimeEnd).format('YYYY/MM/DD hh:mm:ss'),
        content,
        position,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          return err;
        } else {
          return result;
        }
      },
    );

    return {
      res: STATUS_CODE.SUCCESS,
      data: res,
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

/**
 * *Done
 * 获取banner列表
 * @param {Datetime} onlineTimeStart    ** 上线时间
 * @param {Datetime} onlineTimeEnd      ** 下线时间
 * @param {String}   position           ** 0 首页顶部，1 电影页顶部
 * @param {Number}   jumpType           ** 0-无跳转 ** 1-小程序(内部) ** 2-H5 ** 3-文字弹窗 ** 4-小程序(外部)
 * @param {Number}   status             ** 0-正常   ** 1-已冻结 ** 2-已删除
 */
async function getBannerList({
  onlineTimeStart,
  onlineTimeEnd,
  position = 0,
  jumpType = jumpTypeMap.get('all'),
  status = null,
}) {
  const sql = [`select * from banner where position = ${position} `];

  if (onlineTimeStart && dayjs(onlineTimeStart).isValid()) {
    sql.push(`online_time_start >= '${dayjs(onlineTimeStart).format('YYYY/MM/DD hh:mm:ss')}'`);
  }

  if (onlineTimeEnd && dayjs(onlineTimeEnd).isValid()) {
    sql.push(`online_time_end <= '${dayjs(onlineTimeEnd).format('YYYY/MM/DD hh:mm:ss')}'`);
  }

  if (jumpType !== jumpTypeMap.get('all')) {
    sql.push(`jump_type = ${jumpType}`);
  }

  if (status === bannerStatusMap.get('frozen')) {
    sql.push(`is_frozen = ${boolMap.get('truthy')}`);
  }

  if (status === bannerStatusMap.get('deleted')) {
    sql.push(`is_delete = ${boolMap.get('truthy')}`);
  }

  try {
    const list = await db.query(sql.join(' and '));
    return {
      res: STATUS_CODE.SUCCESS,
      data: list,
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

/**
 * *Done
 * 获取banner列表
 * @param {Datetime} onlineTimeStart    ** 上线时间
 * @param {Datetime} onlineTimeEnd      ** 下线时间
 * @param {String}   position           ** 0 首页顶部，1 电影页顶部
 * @param {Number}   jumpType           ** 0-无跳转 ** 1-小程序(内部) ** 2-H5 ** 3-文字弹窗 ** 4-小程序(外部)
 * @param {Number}   status             ** 0-未冻结   ** 1-已冻结 ** 2-未删除 ** 3-已删除
 */
async function updateBanner({
  id = '',
  onlineTimeStart,
  onlineTimeEnd,
  position = null,
  jumpType,
  status,
}) {
  const sql = [];

  if (!id) {
    return false;
  }

  if (isTimeValid(onlineTimeStart)) {
    sql.push(`online_time_start = ${dayjs(onlineTimeStart).format('YYYY/MM/DD hh:mm:ss')}`);
  }

  if (isTimeValid(onlineTimeEnd)) {
    sql.push(`online_time_end = ${dayjs(onlineTimeEnd).format('YYYY/MM/DD hh:mm:ss')}`);
  }

  if (typeof position === 'number') {
    sql.push(`position = ${position}`);
  }

  if (typeof jumpType === 'number') {
    sql.push(`jump_type = ${jumpType}`);
  }

  if (status === bannerStatusMap.get('normal') || status === bannerStatusMap.get('frozen')) {
    sql.push(`is_frozen = ${status}`);
  }

  if (status === bannerStatusMap.get('deleted') || status === bannerStatusMap.get('undeleted')) {
    sql.push(`is_delete = ${status - 2}`);
  }

  try {
    await db.query(`UPDATE banner SET ` + sql.join(',') + ` where id = ${id}`);
    return {
      res: STATUS_CODE.SUCCESS,
      msg: '更新成功',
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

async function deleteBannerById({ id = '' }) {
  if (!id) {
    return {
      res: STATUS_CODE.COMMON_ERR,
      msg: 'id 不可为空',
    };
  }

  const [target] = await db.selectAllById('banner', id);

  if (!target) {
    return {
      res: STATUS_CODE.COMMON_ERR,
      msg: '删除对象不存在',
    };
  }

  try {
    await updateBanner({ status: bannerStatusMap.get('deleted'), id });

    return {
      res: STATUS_CODE.SUCCESS,
      msg: '删除成功',
    };
  } catch ({ res = STATUS_CODE.UNKNOWN_ERR, msg = '系统异常' }) {
    return {
      res,
      msg,
    };
  }
}

module.exports = {
  addBanner,
  getBannerList,
  updateBanner,
  deleteBannerById,
};
