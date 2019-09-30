const mysql = require("mysql");
const co = require("co-mysql");
const config = require("../config");

let connection = mysql.createPool({
    host:config.DB_HOST,
    user:config.DB_USER,
    password:config.DB_PASS,
    database:config.DB_NAME,
    port : '3306'
})

module.exports = co(connection);