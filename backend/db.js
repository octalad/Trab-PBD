const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "octa123",
  database: "pontos_turisticos",
});

module.exports = db.promise();
