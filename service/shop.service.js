const db = require('../utils/db');
const dayjs = require('dayjs');

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

async function getClearShopList(openId) {
  const shopList = await getShopList();
  const blackMenuList = await getPersonalBlackMenuList(openId);

  const clearList = shopList.reduce((list, item) => {
    if (blackMenuList.some((el) => el.sid === item.id)) {
      return list;
    } else {
      return [...list, item];
    }
  }, []);

  return clearList;
}

function addShop({ name, logo = '', count = 0 }) {
  return db
    .query(`INSERT INTO tmp_shop (name, logo, count) VALUES ('${name}', '${logo}', ${count});`)
    .then((res) => res);
}

function findShopByShopId(shopId) {
  return db
    .query(
      `
    select * from tmp_shop where id = '${shopId}'
  `,
    )
    .then((list = []) => list);
}

function updateShop({ shopId, name, logo, count }) {
  return db
    .query(
      `
  UPDATE tmp_shop
  SET name = '${name}', logo = '${logo}', count = ${count}
  WHERE id = '${shopId}';
  `,
    )
    .then((res) => res);
}

function getPersonalBlackMenuList(openId) {
  return db
    .query(
      `
    SELECT b.id, b.sid, s.name,s.logo,b.open_id
    FROM tmp_black_menu b
    LEFT JOIN tmp_shop s on b.sid = s.id
    WHERE b.open_id = '${openId}' and b.is_delete = 1
  `,
    )
    .then((list = []) => {
      return list;
    });
}

async function addPersonalBlackMenuRecord({ openId, shopId }) {
  const record = await findShopInBackMenu({ openId, shopId });

  if (record.length > 0) {
    return updatePersonalBlackMenuRecord({ openId, shopId, isDelete: 1 });
  }

  return db.query(`
    INSERT INTO tmp_black_menu (sid, open_id, create_at) VALUES ('${shopId}', '${openId}', '${dayjs().format(
    'YYYY-MM-DD hh:mm:ss',
  )}');
  `);
}

function updatePersonalBlackMenuRecord({ openId, shopId, isDelete }) {
  return db.query(`
    UPDATE tmp_black_menu
    SET is_delete = ${isDelete}
    WHERE open_id = '${openId}' and sid = '${shopId}';
  `);
}

function findShopInBackMenu({ openId, shopId }) {
  return db
    .query(
      `
    select * from tmp_black_menu where open_id = '${openId}' and sid = '${shopId}'
  `,
    )
    .then((list = []) => list);
}

module.exports = {
  addShop,
  getShopList,
  getPersonalBlackMenuList,
  addPersonalBlackMenuRecord,
  updatePersonalBlackMenuRecord,

  findShopByShopId,
  updateShop,
  getClearShopList,
};
