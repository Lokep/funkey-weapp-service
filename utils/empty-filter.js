const { isObject } = require('.');

function emptyFilter(obj) {
  const result = {};

  if (isObject(obj)) {
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) {
        continue;
      }

      const val = obj[key];

      result[key] = val === '' || val === undefined ? null : val;
    }
  }

  return result;
}

module.exports = {
  emptyFilter,
};
