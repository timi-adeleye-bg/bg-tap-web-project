//import required modules
const pool = require("../database/dbConfig");
const moment = require("moment");
const { requiredKeys } = require("../utils/requiredKeys");
const { getOperatorStatus } = require("./operatorservices");

//Function to validate Field Officer Data
const validateFieldOfficerData = async (req) => {
  try {
    //validate fields passed by client
    const {
      full_name,
      email,
      phone_number,
      sex,
      date_of_birth,
      bvn,
      nin,
      state,
      lga,
      hub,
      government_id,
      government_id_type,
    } = req.body;
    const keys = [
      "full_name",
      "email",
      "phone_number",
      "sex",
      "date_of_birth",
      "bvn",
      "nin",
      "state",
      "lga",
      "hub",
      "government_id",
      "government_id_type",
    ];
    await requiredKeys(req, keys);

    //declare regex pattern to validate bvn, nin, email, phone number and government_id
    const pattern = /^(?!0{11})\d{11}$/;
    const emailPattern = /^\S+@\S+\.\S+$/;

    //validate information passed to the fields
    if (
      !full_name ||
      !email ||
      !phone_number ||
      !sex ||
      !date_of_birth ||
      !bvn ||
      !nin ||
      !state ||
      !lga ||
      !hub ||
      !government_id ||
      !government_id_type
    ) {
      throw new Error(`${keys} are all required`);
    } else if (!emailPattern.test(email)) {
      throw new Error("Email not valid");
    } else if (!pattern.test(phone_number)) {
      throw new Error("Please enter a valid Phone Number");
    } else if (!["male", "female"].includes(sex.toLowerCase())) {
      throw new Error("Sex must either be male || female");
    } else if (!moment(date_of_birth, "YYYY-MM-DD", true).isValid()) {
      throw new Error("Enter Date of Birth format in YYYY-MM-DD");
    } else if (!pattern.test(bvn)) {
      throw new Error("Please enter a Valid BVN");
    } else if (!pattern.test(nin)) {
      throw new Error("Invalid NIN");
    } else if (
      !["driver's license", "voter's card", "international passport"].includes(
        government_id_type.toLowerCase()
      )
    ) {
      throw new Error(
        "Government ID Type must either be driver's license || voter's card || international passport"
      );
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

//validate government id based on ID Type chosen
const validateGovernmentID = (req) => {
  try {
    const { government_id, government_id_type } = req.body;

    // Define the validation patterns for each government type
    const validationPatterns = {
      "driver's license": /^(?!0+$)[A-Z0-9]{12}$/,
      "voter's card": /^(?!0+$)[A-Z0-9]{20}$/,
      "international passport": /^[A-Z][1-9][0-9]{7}$/,
    };

    // Validate government ID based on the government type chosen
    const validationPattern =
      validationPatterns[government_id_type.toLowerCase().trim()];
    if (!validationPattern) {
      throw new Error("Invalid government ID type");
    }

    if (!validationPattern.test(government_id)) {
      throw new Error("Government ID does not belong to the type you chose");
    }
  } catch (error) {
    throw error;
  }
};

//get field officer user id
const getFieldOfficerUserId = async (req) => {
  try {
    const { email } = req.body;

    //connect to database and check if user is registered as a Field Officer in the system and return user ID
    const conn = await pool.connect();
    const sql = "SELECT * FROM users WHERE email = ($1);";
    const result = await conn.query(sql, [email.toLowerCase().trim()]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error(
        "The user you are about to recruit doesn't exist in our system and needs to register on our platform"
      );
    } else if (rows.role !== "field officer") {
      throw new Error("User is not a Field Officer and can't be recruited");
    } else {
      return rows.user_id;
    }
  } catch (error) {
    throw error;
  }
};

//Check for duplicate NIN in the field officer table
const checkFODuplicateNIN = async (req) => {
  try {
    const { nin } = req.body;

    const conn = await pool.connect();
    const sql = "SELECT nin from field_officer;";
    const result = await conn.query(sql);
    const rows = result.rows;
    conn.release();

    const foundNIN = rows.find((user) => user.nin === nin);

    if (foundNIN) {
      throw new Error("NIN already in use");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//check for duplicate government_id
const checkDuplicateID = async (req) => {
  try {
    const { government_id, government_id_type } = req.body;

    //connect to database and check if government id already exist based on id_type
    const conn = await pool.connect();
    const sql =
      "SELECT government_id FROM field_officer WHERE government_id_type = ($1);";
    const result = await conn.query(sql, [
      government_id_type.toLowerCase().trim(),
    ]);
    const rows = result.rows;
    conn.release();

    const foundID = rows.find((user) => user.government_id === government_id);

    if (foundID) {
      throw new Error("ID already in use");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//check if field officer is already recruited
const checkDuplicateFieldOfficer = async (req) => {
  try {
    const user_id = await getFieldOfficerUserId(req);
    const operator_id = await getOperatorStatus(req);

    //connect to database to check if user already exist
    const conn = await pool.connect();
    const sql = "SELECT * FROM field_officer WHERE user_id = ($1);";
    const result = await conn.query(sql, [user_id]);
    const rows = result.rows[0];
    conn.release();

    if (rows) {
      if (rows.operator_id === operator_id) {
        throw new Error("You already recruited this Field Officer");
      } else {
        throw new Error("Field Officer already recruited by someone else");
      }
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//validate hub
const validateHub = async (req) => {
  try {
    const { hub } = req.body;

    //connect to database to check if hub exist
    const conn = await pool.connect();
    const sql = "SELECT * FROM hub WHERE name = ($1);";
    const result = await conn.query(sql, [hub.toLowerCase().trim()]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("Hub selected doesn't exist");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validateFieldOfficerData,
  validateGovernmentID,
  getFieldOfficerUserId,
  checkFODuplicateNIN,
  checkDuplicateID,
  checkDuplicateFieldOfficer,
  validateHub,
};
