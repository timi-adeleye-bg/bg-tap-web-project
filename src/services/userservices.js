//import required modules
const pool = require("../database/dbConfig");
const { requiredKeys } = require("../utils/requiredKeys");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

//load dotenv configuration
dotenv.config();

//Check for duplicate email address
const checkDuplicateEmail = async (req) => {
  try {
    const { email } = req.body;

    const conn = await pool.connect();
    const sql = "SELECT email from users;";
    const result = await conn.query(sql);
    const rows = result.rows;
    conn.release();

    const userAvailable = rows.find(
      (user) => user.email.trim() === email.trim()
    );

    if (userAvailable) {
      throw new Error("Email address already in use");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//Validating User Input
const validateUserData = async (req) => {
  try {
    const { name, email, password, role } = req.body;

    const emailPattern = /^\S+@\S+\.\S+$/;

    //valid input keys to be passed in by the client
    const keys = ["name", "email", "password", "role"];
    await requiredKeys(req, keys);

    //check if name or email or password is not passed
    if (!name || !email || !password) {
      throw new Error("Name, email and password fields are required");
    } else if (password.trim() === "") {
      throw new Error("Password field can not be empty");
    } else if (typeof role !== "undefined" && typeof role !== "string") {
      throw new Error("Role must be a string");
    } else if (
      role !== undefined &&
      !["operator", "admin"].includes(role.toLowerCase())
    ) {
      throw new Error("You can either sign up as an operator or as a member");
    } else if (!emailPattern.test(email.trim())) {
      throw new Error("Please enter a valid email address");
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

//decode token to get user_id
const getUserId = (req) => {
  try {
    const jwtToken = req.headers.authorization || req.headers.Authorization;
    const decodedToken = jwt.decode(jwtToken);

    //obtain the user id from the payload passed into the token
    const user_id = parseInt(decodedToken.user.user.id);

    return user_id;
  } catch (error) {
    throw error;
  }
};

//get user role
const getUserRole = async (req) => {
  try {
    const user_id = await getUserId(req);

    //connect to database and get current role of user
    const conn = await pool.connect();
    const sql = `SELECT * FROM users WHERE user_id = ($1);`;
    const result = await conn.query(sql, [user_id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User is not Valid");
    } else {
      return rows.role;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkDuplicateEmail,
  validateUserData,
  getUserId,
  getUserRole,
};
