const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'admin_user',
  password: process.env.MYSQL_PASSWORD || 'admin123',
  database: process.env.MYSQL_DATABASE || 'productos_react',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
