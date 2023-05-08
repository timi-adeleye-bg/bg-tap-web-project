//import pool from pg module
const { Pool } = require("pg");
const dotenv = require("dotenv");

//load confinguration to access .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;
