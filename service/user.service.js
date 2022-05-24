const db = require('../utils/db')

const getUserList = async (ctx, next) => {
  let result = await db.selectAll('user')
  return result
}


module.exports = {
  getUserList
}