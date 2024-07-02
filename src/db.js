// node-mysql-app/db.js

const mysql = require("mysql2");

require("dotenv").config();

connection = mysql.createConnection({
  host: monorail.proxy.rlwy.net,// <MYSQL host>,
  port: 49142,// <MYSQL port>,
  user: root,// <MYSQL username>,
  password: MvdcJmNQdZViApHLzbwSGTqoQlMooTZs,// <MYSQL password>,
  database: railway// <MYSQL database name>,
});
connection.connect((err) => {
  if (err) {
    console.error("CONNECT FAILED", err.code);
  } else console.log("CONNECTED");
});

module.exports = { connection };
