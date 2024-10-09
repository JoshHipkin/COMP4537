const mysql = require("mysql/promise");

const dbConfig = {
  host: process.env.HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.PASS,
  database: process.env.DB_NAME,
  multipleStatements: false,
  namedPlaceholders: true,
};

let database = mysql.createPool(dbConfig);

module.exports = database;
