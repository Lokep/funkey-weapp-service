const dayjs = require('dayjs');

const isTimeValid = (time) => time && dayjs(time).isValid();

module.exports = {
  isTimeValid,
};
