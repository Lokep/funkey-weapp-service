const config = require('../config/mysql.config')

const mysql = require('mysql')

const pool = mysql.createPool({
  host: config.HOST,
  user: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE
})

let query = (sql, values)=>{
  return new Promise((resolve, reject)=>{
    pool.getConnection((err, connection)=>{
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows)=>{
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

let createTable = sql => {
  return query(sql, [])
}

let selectAll = (table)=>{
  let _sql = "select * from ??"
  return query(_sql, [table])
}

let selectAllById = (table, id)=>{
  let _sql = "select * from ?? where id = ?"
  return query(_sql, [table, id])
}

let selectKeys = (table, keys)=>{
  let _sql = "select ?? from ??"
  return query(_sql, [keys, table])
}


module.exports = {
  query,
  createTable,
  selectAll,
  selectAllById,
  selectKeys,
}