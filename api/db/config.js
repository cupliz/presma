require('dotenv').config()
const path = require('path')
module.exports = {
  client: 'mysql2',
  connection: process.env.DB_URL,
  // client: 'sqlite3',
  // connection: {
  //   filename: path.join(__dirname, './mydb.sqlite3'),
  // },
  migrations: {
    directory: path.join(__dirname, './migrations'),
  },
  seeds: {
    directory: path.join(__dirname, './seeds'),
  },
  pool: {
    min: 2,
    max: 10,
    afterCreate: function (conn, cb) {
      conn.query('SET sql_mode="";', function (err) {
        cb(err, conn)
      })
    }
  },
  useNullAsDefault: true
}