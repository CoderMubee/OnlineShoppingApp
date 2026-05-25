const mysql  = require('mysql2');
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Abeyed1992.',
    database:'ummuMujahid_inventory'
})

module.exports = pool;