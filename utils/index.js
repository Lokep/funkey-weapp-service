const dayjs = require('dayjs');

const isTimeValid = (time) => time && dayjs(time).isValid();

const isString = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'String';
};

const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number';
};

const isObject = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Object';
};

module.exports = {
  isTimeValid,
  isNumber,
  isString,
  isObject,
};
