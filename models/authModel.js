const db = require("../connection");

function createUser(values, callback) {
  const sql = `
    INSERT INTO users
    (full_name, email, password, phone, address, state, country, gender, newsletter)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, values, callback);
}

function getUserByEmail(email, callback) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], callback);
}

module.exports = {
  createUser,
  getUserByEmail
};