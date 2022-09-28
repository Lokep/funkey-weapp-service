const db = require('../utils/db');

function getShopList() {
  return db
    .query(
      `
    select * from tmp_shop order by count desc
  `,
    )
    .then((list = []) => {
      return list;
    })
    .catch((err) => err);
}

function addShop({ name, logo = '', count = 0 }) {
  return db
    .query(`INSERT INTO tmp_shop (name, logo, count) VALUES ('${name}', '${logo}', ${count});`)
    .then((res) => res);
}

module.exports = {
  addShop,
  getShopList,
};
