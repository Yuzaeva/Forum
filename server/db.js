const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'forum_app',
  password: '324322',
  port: 5432,
});

module.exports = pool;
