const pool = require("../database/dbConfig");
const { requiredKeys } = require("../utils/requiredKeys");
const { getUserId, getUserRole } = require("../services/userservices");
const {
  operatorId,
  validateOperatorData,
  validateNationality,
  validateState,
  validatelGA,
  getOperatorStatus,
  checkDuplicateUser,
  checkDuplicateNIN,
  validateProduct,
  validateSeed,
  checkDuplicateSelection,
} = require("../services/operatorservices");

//sign up a new operator
const operatorSignUp = async (req) => {
  try {
    const {
      full_name,
      phone_number,
      nationality,
      state,
      lga,
      sex,
      date_of_birth,
      nin,
    } = req.body;

    //get user role and validate if user signed up as an operator
    const role = await getUserRole(req);
    if (role !== "operator") {
      throw new Error("You need to be an operator to complete registration");
    }

    //validate operator data fields
    await validateOperatorData(req);

    //check if user is already an operator
    await checkDuplicateUser(req);

    //validate nationality, state and LGA
    await validateNationality(req);
    await validateState(req);
    await validatelGA(req);

    //check for duplicate nin values
    await checkDuplicateNIN(req);

    //generate operator ID and get user_id
    const operator_id = operatorId();
    const user_id = await getUserId(req);

    //connect to database and create operator profile
    const conn = await pool.connect();
    const sql =
      "INSERT INTO operator(operator_id, full_name, phone_number, nationality, state, lga, sex, date_of_birth, nin, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;";
    const values = [
      operator_id,
      full_name.trim(),
      phone_number,
      nationality.toLowerCase().trim(),
      state.toLowerCase().trim(),
      lga.toLowerCase().trim(),
      sex.toLowerCase().trim(),
      date_of_birth,
      nin,
      user_id,
    ];
    const result = await conn.query(sql, values);
    conn.release();

    console.log("Operator Registration Completed");
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

//picture upload
const uploadPicture = async (req) => {
  try {
    const user_picture = req.file.path;
    if (!req.file.path) {
      throw new Error("No image uploaded");
    }

    //get user_id
    const user_id = await getUserId(req);

    //connect to database and update picture
    const conn = await pool.connect();
    const sql = `UPDATE operator SET user_picture = ($1), updated_at = NOW() WHERE user_id = ($2) RETURNING *;`;
    const values = [user_picture, user_id];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User is not an operator");
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

//update operator profile
const operatorUpdate = async (req) => {
  try {
    const { full_name, phone_number, nationality, state, lga, sex } = req.body;
    const keys = [
      "full_name",
      "phone_number",
      "nationality",
      "state",
      "lga",
      "sex",
    ];
    const pattern = /^(?!0{11})\d{11}$/;

    //validate operator input
    await requiredKeys(req, keys);

    //run checks on the inputed fields
    let newName = null;
    if (full_name && full_name.trim() !== "") {
      newName = full_name.trim();
    }

    let newNumber = null;
    if (phone_number && phone_number.trim() !== "") {
      if (!pattern.test(phone_number)) {
        throw new Error("Please provide valid Phone Number");
      } else {
        newNumber = phone_number;
      }
    }

    let newSex = null;
    if (sex && sex.trim() !== "") {
      if (!["male", "female"].includes(sex.toLowerCase())) {
        throw new Error("Sex must either be Male or Female");
      }
    } else {
      newSex = sex.toLowerCase().trim();
    }

    let newNation = null;
    if (nationality && nationality.trim() !== "") {
      if (state && state.trim() !== "" && lga && lga.trim() !== "") {
        await validateNationality(req);
        newNation = nationality.toLowerCase().trim();
      } else {
        throw new Error(
          "Changing your nation will require you to also update your state and lga"
        );
      }
    }

    let newState = null;
    if (state && state.trim() !== "") {
      if (
        nationality &&
        nationality.trim() !== "" &&
        lga &&
        lga.trim() !== ""
      ) {
        await validateState(req);
      } else {
        throw new Error(
          "Changing your state will require you to also update your nationality and lga"
        );
      }
      newState = state.toLowerCase().trim();
    }

    let newlGA = null;
    if (lga && lga.trim() !== "") {
      if (
        nationality &&
        nationality.trim() !== "" &&
        state &&
        state.trim() !== ""
      ) {
        await validatelGA(req);
      } else {
        throw new Error(
          "Changing your lga will require you to also update your nationality and state"
        );
      }
      newlGA = lga.toLowerCase().trim();
    }

    //obtain userId if user exist in the database
    const user_id = await getUserId(req);

    //connect to database and update profile
    const conn = await pool.connect();
    const sql =
      "UPDATE operator SET full_name = COALESCE($1, full_name), phone_number = COALESCE($2, phone_number), nationality = COALESCE($3, nationality), state = COALESCE($4, state), lga = COALESCE($5, lga), sex = COALESCE($6, sex), updated_at = now() WHERE user_id = ($7) RETURNING *;";
    const values = [
      newName,
      newNumber,
      newNation,
      newState,
      newlGA,
      newSex,
      user_id,
    ];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User is not an operator");
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

//Function to enable operator select product and seed type
const selectProduct = async (req) => {
  try {
    //define input parameters
    const { product_id, seed_id } = req.params;

    //obatin operator ID if operator is verified
    const operator_id = await getOperatorStatus(req);

    //check for duplicate selection
    await checkDuplicateSelection(req);

    //validate product and seed type
    await validateProduct(req);
    await validateSeed(req);

    //connect to database and create operator selection
    const conn = await pool.connect();
    const sql =
      "INSERT INTO selection(operator_id, product_id, seed_id) VALUES($1, $2, $3) RETURNING *;";
    const result = await conn.query(sql, [operator_id, product_id, seed_id]);
    const rows = result.rows[0];
    conn.release();

    console.log("Operator Registration Completed");
    return rows;
  } catch (error) {
    throw error;
  }
};

//Function to get all products selected by an operator
const getOperatorSelections = async (req) => {
  try {
    //get operator id
    const operator_id = await getOperatorStatus(req);

    //connect to database and fetch all products and seed type selected by operator
    const conn = await pool.connect();
    const sql =
      "SELECT s.operator_id, p.name AS product_name, sd.name AS seed_name FROM selection s JOIN products p ON s.product_id = p.product_id JOIN seed sd ON sd.seed_id = s.seed_id WHERE s.operator_id = ($1);";
    const result = await conn.query(sql, [operator_id]);
    const rows = result.rows;
    conn.release();

    if (!rows) {
      throw new Error(
        "Operator doesn't have an product and seed type selected yet"
      );
    }
    return rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  operatorSignUp,
  uploadPicture,
  operatorUpdate,
  selectProduct,
  getOperatorSelections,
};
