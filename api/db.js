const mysql = require("mysql");
const config = require("./db.config");

const connection = mysql.createConnection({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
});

module.exports = connection;