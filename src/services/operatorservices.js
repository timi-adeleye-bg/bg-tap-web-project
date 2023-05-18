const pool = require("../database/dbConfig");
const moment = require("moment");
const { getUserId } = require("./userservices");
const { requiredKeys } = require("../utils/requiredKeys");

//function to generate operator Id
const operatorId = () => {
  return "0-" + (Math.floor(Math.random() * 100000) + 1).toString();
};

//validate operator fields
const validateOperatorData = async (req) => {
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

    const keys = [
      "full_name",
      "phone_number",
      "nationality",
      "state",
      "lga",
      "sex",
      "date_of_birth",
      "nin",
    ];
    await requiredKeys(req, keys);

    //declare regex pattern to validate phone number and nin
    const pattern = /^(?!0{11})\d{11}$/;

    //check for rquired fields
    if (
      !full_name ||
      !phone_number ||
      !nationality ||
      !state ||
      !lga ||
      !sex ||
      !date_of_birth ||
      !nin
    ) {
      throw new Error("All fields are required");
    } else if (!pattern.test(phone_number)) {
      throw new Error("Phone Number not valid");
    } else if (!["male", "female"].includes(sex.toLowerCase())) {
      throw new Error("Sex must either be Male or Female");
    } else if (!pattern.test(nin)) {
      throw new Error("Invalid NIN");
    } else if (!moment(date_of_birth, "YYYY-MM-DD", true).isValid()) {
      throw new Error("Enter Date of Birth format in YYYY-MM-DD");
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

// validate operator nationality
const validateNationality = async (req) => {
  try {
    const { nationality } = req.body;

    //connect to database and check if choice of nation exist
    const conn = await pool.connect();
    const sql = `SELECT id, country FROM Nationality WHERE country = ($1);`;
    const result = await conn.query(sql, [nationality.toLowerCase().trim()]);
    const country = result.rows[0];
    conn.release();

    if (!country) {
      throw new Error(
        "Country not valid / Services not available in your nation yet"
      );
    }
    //return country id
    return country.id;
  } catch (error) {
    throw error;
  }
};

//validate operator state of operation
const validateState = async (req) => {
  try {
    const { state, nationality } = req.body;
    let countryID;

    //fetch country Id
    if (nationality) {
      countryID = await validateNationality(req);
    }

    //connect to database to fetch country id associated with selected state
    const conn = await pool.connect();
    const sql =
      "SELECT state_id, name, country_id FROM state WHERE name = ($1);";
    const result = await conn.query(sql, [state.toLowerCase().trim()]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("State is not Valid");
    }

    //validate if selected state belong to the operator nationality
    const stateCountryID = rows.country_id;
    if (countryID && countryID !== stateCountryID) {
      throw new Error("State selected doesn't exist in your nation");
    }
    return rows.state_id;
  } catch (error) {
    throw error;
  }
};

//validate operator Local Government Selected
const validatelGA = async (req) => {
  try {
    const { lga } = req.body;

    //fetch state Id
    const stateID = await validateState(req);

    //connect to database to validate if the state_id and lga exist
    const conn = await pool.connect();
    const sql = `SELECT name, state_id FROM lga WHERE name = ($1) AND state_id = ($2);`;
    const values = [lga.toLowerCase().trim(), stateID];
    const result = await conn.query(sql, values);
    const rows = result.rows;
    conn.release();

    if (rows.length === 0) {
      throw new Error("Local Government selected doesn't exist in your state");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

//get operator status
const getOperatorStatus = async (req) => {
  try {
    //get user_id
    const user_id = await getUserId(req);

    //connect to database to check operator verified status
    const conn = await pool.connect();
    const sql = `SELECT * FROM operator WHERE user_id = ($1);`;
    const result = await conn.query(sql, [user_id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User is not an operator");
    } else if (rows.is_verified === false) {
      throw new Error("You need to be verified to complete operation");
    } else {
      return rows.operator_id;
    }
  } catch (error) {
    throw error;
  }
};

//check for duplicate user
const checkDuplicateUser = async (req) => {
  try {
    const user_id = await getUserId(req);

    //connect to database to check if user already exist
    const conn = await pool.connect();
    const sql = `SELECT * FROM operator WHERE user_id = ($1);`;
    const result = await conn.query(sql, [user_id]);
    const rows = result.rows[0];
    conn.release();

    if (rows) {
      throw new Error("Operator Profile already exist");
    } else {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

//Check for duplicate NIN
const checkDuplicateNIN = async (req) => {
  try {
    const { nin } = req.body;

    const conn = await pool.connect();
    const sql = "SELECT nin from operator;";
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

//validate product
const validateProduct = async (req) => {
  try {
    const { product_id } = req.params;

    //connect to database and check if choice of product exist
    const conn = await pool.connect();
    const sql = `SELECT product_id, name FROM products WHERE product_id = ($1);`;
    const result = await conn.query(sql, [product_id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("Product not Found");
    } else {
      return rows.product_id;
    }
  } catch (error) {
    throw error;
  }
};

//validate seed type
const validateSeed = async (req) => {
  try {
    //const { product_id, seed_id } = req.params;
    const { seed_id } = req.params;
    console.log(seed_id);

    //get product ID
    const productID = await validateProduct(req);
    console.log(productID);

    //connect to database to fetch product id associated with selected seed type
    const conn = await pool.connect();
    const sql =
      "SELECT seed_id, name, product_id FROM seed WHERE seed_id = ($1);";
    const result = await conn.query(sql, [seed_id]);
    const rows = result.rows[0];
    //console.log(rows);
    conn.release();

    if (!rows) {
      throw new Error("Seed not Found");
    }

    //validate if selected seed type belongs to the product chosen
    const seedProductID = rows.product_id;
    if (!(productID === seedProductID)) {
      throw new Error("Seed doesn't belong to selected Product");
    }

    return true;
  } catch (error) {
    throw error;
  }
};

//check for duplicate product seed selection type
const checkDuplicateSelection = async (req) => {
  try {
    //take in input parameters
    const { product_id, seed_id } = req.params;
    const operator_id = await getOperatorStatus(req);

    //connect to database and check if selection exist based on input parameters
    const conn = await pool.connect();
    const sql =
      "SELECT * FROM selection WHERE operator_id = ($1) AND product_id = ($2) AND seed_id = ($3);";
    const result = await conn.query(sql, [operator_id, product_id, seed_id]);
    const rows = result.rows[0];
    conn.release();

    if (rows) {
      throw new Error(
        "You already have this Product and Seed Type in your collection"
      );
    }
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
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
};
