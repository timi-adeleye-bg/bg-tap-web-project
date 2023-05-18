//import required modules
const pool = require("../database/dbConfig");
const {
  getOperatorStatus,
  validateState,
  validatelGA,
  checkDuplicateNIN,
} = require("../services/operatorservices");
const {
  validateFieldOfficerData,
  validateGovernmentID,
  getFieldOfficerUserId,
  checkFODuplicateNIN,
  checkDuplicateFieldOfficer,
  validateHub,
  checkDuplicateID,
} = require("../services/foservices");

//recruit a new field officer
const recruitFieldOfficer = async (req) => {
  try {
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

    //validate data passed by client
    await validateFieldOfficerData(req);

    //validate if user to be recruited is a field officer and obtain user id
    const user_id = await getFieldOfficerUserId(req);

    //obtain operator id
    const operator_id = await getOperatorStatus(req);

    //validate state, lga and hub
    await validateState(req);
    await validatelGA(req);
    await validateHub(req);

    //check for duplicate nin and duplicate field officer
    await checkFODuplicateNIN(req);
    await checkDuplicateNIN(req);
    await checkDuplicateFieldOfficer(req);

    //validate government Id based on Government type and check if it already exist
    await validateGovernmentID(req);
    await checkDuplicateID(req);

    //populate field officer into database
    const conn = await pool.connect();
    const sql =
      "INSERT INTO field_officer(full_name, phone_number, sex, date_of_birth, bvn, nin, state, lga, hub, government_id, government_id_type, operator_id, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;";
    const values = [
      full_name.trim(),
      phone_number,
      sex.toLowerCase().trim(),
      date_of_birth,
      bvn,
      nin,
      state.toLowerCase().trim(),
      lga.toLowerCase().trim(),
      hub.toLowerCase().trim(),
      government_id,
      government_id_type.toLowerCase().trim(),
      operator_id,
      user_id,
    ];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    conn.release();

    console.log("Field Officer recruited successfully");
    return rows;
  } catch (error) {
    throw error;
  }
};

//upload government ID card image
const uploadIDImage = async (req) => {
  try {
    const id_card = req.file.path;
    if (!req.file.path) {
      throw new Error("No image uploaded");
    }

    //obtain field officer id as a param and operator id
    const { id } = req.params;
    const operator_id = await getOperatorStatus(req);

    //connect to database and upload field officer picture
    const conn = await pool.connect();
    const sql =
      "UPDATE field_officer SET government_id_card = ($1), updated_at = NOW() WHERE user_id = ($2) AND operator_id = ($3) RETURNING *;";
    const result = await conn.query(sql, [id_card, id, operator_id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("Unable to complete operation");
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { recruitFieldOfficer, uploadIDImage };
