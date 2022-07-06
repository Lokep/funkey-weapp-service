const db = require('../utils/db');

const getUserList = async () => {
  const result = await db.selectAll('user');
  return result;
};

module.exports = {
  getUserList,
};
