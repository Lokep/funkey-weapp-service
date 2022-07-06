const dayjs = require('dayjs');

const isTimeValid = (time) => time && dayjs(time).isValid();

const isString = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'String';
};

const isNumber = (o) => {
  return Object.prototype.toString.call(o).slice(8, -1) === 'Number';
};

module.exports = {
  isTimeValid,
  isNumber,
  isString,
};
