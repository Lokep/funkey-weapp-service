/**
 * ** 0-无跳转 ** 1-小程序(内部) ** 2-H5 ** 3-文字弹窗 ** 4-小程序(外部)
 * ** -1 用于搜索，表示全部
 */
const jumpTypeMap = new Map([
  ['all', -1],
  ['silence', 0],
  ['weapp', 1],
  ['web', 2],
  ['toast', 3],
  ['customWeapp', 4],
]);

const bannerStatusMap = new Map([
  ['normal', 0],
  ['frozen', 1],
  ['undeleted', 2],
  ['deleted', 3],
]);

module.exports = {
  jumpTypeMap,
  bannerStatusMap,
};
