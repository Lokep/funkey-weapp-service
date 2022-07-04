const mysql = require('mysql');
const config = require('../config/mysql.config');
const STATUS_CODE = require('../constants/status-code');

const pool = mysql.createPool({
  host: config.HOST,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE,
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject({
          res: STATUS_CODE.DATABASE_CONNECTION_ERR,
          msg: err,
        });
      } else {
        connection.query(sql, values, (error, rows) => {
          if (error) {
            reject({
              res: STATUS_CODE.UNKNOWN_ERR,
              msg: error,
            });
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};

const selectAll = (table) => {
  const _sql = 'select * from ??';
  return query(_sql, [table]);
};

const selectAllById = (table, id) => {
  const _sql = 'select * from ?? where id = ?';
  return query(_sql, [table, id]);
};

const selectKeys = (table, keys) => {
  const _sql = 'select ?? from ??';
  return query(_sql, [keys, table]);
};

module.exports = {
  query,
  selectAll,
  selectAllById,
  selectKeys,
};
