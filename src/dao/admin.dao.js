//import required modules
const pool = require("../database/dbConfig");
const { getUserRole } = require("../services/userservices");

//get all field officers belonging to a particular operator
const getOperatorFieldOfficers = async (req) => {
  try {
    const { id } = req.params;

    //obtain user role and check if user is an admin to complete operation
    const role = await getUserRole(req);
    if (role !== "admin") {
      throw new Error("You cannot complete this operation");
    }

    //connect to field operator table and fetch all field officers belonging to an operator
    const conn = await pool.connect();
    const sql = "SELECT * FROM field_officer WHERE operator_id = ($1);";
    const result = await conn.query(sql, [id]);
    const rows = result.rows;
    conn.release();

    if (rows.length === 0) {
      throw new Error("User does not have any Field officer");
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getOperatorFieldOfficers };
