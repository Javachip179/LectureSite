//MySQL 커넥션 풀 생성

const dbconfig = require('../config/dbconfig.json');
const mysql = require('mysql2');

const conn = mysql.createPool({
  host: dbconfig.host,
  user: dbconfig.user,
  port: dbconfig.port,
  password: dbconfig.password,
  database: dbconfig.database,
  connectionLimit: 50,
});

module.exports = conn;
