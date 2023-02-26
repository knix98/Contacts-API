const mysql = require("mysql");

module.exports.db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});
