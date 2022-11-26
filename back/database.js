const mysql = require("mysql2/promise");

const { databaseSecret} = require("./secret");

exports.pool = mysql.createPool(databaseSecret);
//Pool 을 사용하여 DB에 접근