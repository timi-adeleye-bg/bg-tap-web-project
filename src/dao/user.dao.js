const pool = require("../database/dbConfig");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { requiredKeys } = require("../utils/requiredKeys");
const {
  checkDuplicateEmail,
  validateUserData,
  getUserId,
} = require("../services/userservices");

//load dotenv config
dotenv.config();

//sign up a new user
const userSignUp = async (req) => {
  try {
    const { name, email, password, role } = req.body;
    //validate input fields
    await validateUserData(req);

    //check if email already exists
    await checkDuplicateEmail(req);

    //hash password to improve security
    const hashedPassword = bcrypt.hashSync(
      password + process.env.BCRYPT_PASSWORD,
      parseInt(process.env.SALT_ROUNDS)
    );

    //connect to database
    const conn = await pool.connect();
    const sql = `INSERT INTO users(name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const values = [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      role !== undefined ? role.toLowerCase().trim() : "member",
    ];
    const result = await conn.query(sql, values);
    conn.release();

    console.log("User created Successfully");
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

//function to authenticate user login
const authUserLogin = async (req) => {
  try {
    let { email, password } = req.body;
    email = email.trim();

    //declared required keys
    const keys = ["email", "password"];
    await requiredKeys(req, keys);

    //connect to database to validate user login details
    const conn = await pool.connect();
    const sql = `SELECT user_id, email, password, role FROM users WHERE email = ($1);`;
    const result = await conn.query(sql, [email]);
    const rows = result.rows;
    conn.release();

    //if user exists validate password submitted
    if (rows.length) {
      if (
        bcrypt.compareSync(
          password + process.env.BCRYPT_PASSWORD,
          rows[0].password
        )
      ) {
        return { user: { id: rows[0].user_id, role: rows[0].role } };
      } else {
        throw new Error("Username and/or password do not match");
      }
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    throw error;
  }
};

//update user details
const userProfileUpdate = async (req) => {
  try {
    let { name, role } = req.body;

    //validate user input
    const keys = ["name", "role"];
    await requiredKeys(req, keys);

    //run checks on the inputed fields
    let newName = null;
    if (name && name.trim() !== "") {
      newName = name.trim();
    }

    let newRole = null;
    if (role) {
      if (typeof role !== "string") {
        throw new Error("Role must be a string");
      } else if (!["operator", "member"].includes(role.toLowerCase().trim())) {
        throw new Error("You can either sign up as an operator or as a member");
      } else {
        newRole = role.toLowerCase().trim();
      }
    }

    //obtain userId if user exist in the database
    const user_id = await getUserId(req);

    //connect to database and update profile
    const conn = await pool.connect();
    const sql = `UPDATE users SET name = COALESCE($1, name), role = COALESCE($2, role), updated_at = now() WHERE user_id = ($3) RETURNING *;`;
    const values = [newName, newRole, user_id];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];

    if (!rows) {
      throw new Error("User is not valid");
    }

    conn.release();
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { userSignUp, authUserLogin, userProfileUpdate };
