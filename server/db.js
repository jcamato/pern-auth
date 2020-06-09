const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: process.env.SUPERPW,
  port: 5432,
  database: "jwttutorial",
});

module.exports = pool;
