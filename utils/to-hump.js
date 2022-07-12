const dayjs = require('dayjs');
const { isDate } = require('.');

function toHumpFun(obj) {
  const result = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      const index = key.indexOf('_');
      let newKey = key;
      if (index === -1 || key.length === 1) {
        result[key] = element;
      } else {
        const keyArr = key.split('_');
        const newKeyArr = keyArr.map((item, i) => {
          if (i === 0) return item;
          return item.charAt(0).toLocaleUpperCase() + item.slice(1);
        });
        newKey = newKeyArr.join('');
        result[newKey] = element;
      }

      if (typeof element === 'object' && element !== null && !isDate(element)) {
        result[newKey] = toHumpFun(element);
      }

      if (isDate(element)) {
        result[newKey] = dayjs(element).format('YYYY-MM-DD hh:mm:ss');
      }
    }
  }
  return result;
}

const toHump = async (ctx, next) => {
  await next();
  ctx.body = toHumpFun(ctx.body);
};

module.exports = {
  toHump,
};
