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

      if (typeof element === 'object' && element !== null) {
        result[newKey] = toHumpFun(element);
      }
    }
  }
  console.log('[result]: ', result, '--');
  return result;
}

const toHump = async (ctx, next) => {
  await next();
  ctx.body = toHumpFun(ctx.body);
};

module.exports = {
  toHump,
};
