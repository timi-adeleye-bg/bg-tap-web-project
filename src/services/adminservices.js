//import rquired modules
const pool = require("../database/dbConfig");
const { getUserRole } = require("../services/userservices");

//validate if user has been recruited and obtain operator id
const checkRecruitStatus = async (req) => {
  try {
    //obtain user id from params
    const { id } = req.params;

    //connect to database and check if user exist
    const conn = await pool.connect();
    const sql = "SELECT * FROM field_officer WHERE officer_id = ($1);";
    const result = await conn.query(sql, [id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User cannot complete operation");
    }
    return rows.operator_id;
  } catch (error) {
    throw error;
  }
};

//function to shuffle list of questions
const shuffleQuestions = (array, count) => {
  const shuffledQuestion = array.sort(() => Math.random() - 0.5);
  return shuffledQuestion.slice(0, count);
};

//get randomized questions for each category
const getRandomizedQuestions = async (req) => {
  try {
    //validate if user is an admin
    const role = await getUserRole(req);
    if (role !== "admin") {
      throw new Error("You can not perform this operation");
    }

    //connect to database to fetch questions
    const conn = await pool.connect();
    const sql = "SELECT id, question, category, options FROM questions;";
    const result = await conn.query(sql);
    const questions = result.rows;
    conn.release();

    //randomize list of questions fetched from database
    const randomizedQuestions = [];
    const categories = ["A", "B", "C"];

    for (const category of categories) {
      const categoryQuestions = questions.filter(
        (question) => question.category === category
      );
      const randomizedCategoryQuestions = shuffleQuestions(
        categoryQuestions,
        5
      );
      randomizedQuestions.push(...randomizedCategoryQuestions);
    }
    return randomizedQuestions;
  } catch (error) {
    throw error;
  }
};

//get test session id
const getSessionId = async (req) => {
  try {
    const { id } = req.params;

    //connect to database and get session id
    const conn = await pool.connect();
    const sql = "SELECT session_id FROM session WHERE officer_id = ($1);";
    const result = await conn.query(sql, [id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User is yet to conduct test");
    }
    return rows.session_id;
  } catch (error) {
    throw error;
  }
};

//check if user already conducted test session
const checkDuplicateUserSession = async (req) => {
  try {
    const { id } = req.params;

    //connect to database and get session id
    const conn = await pool.connect();
    const sql = "SELECT * FROM session WHERE officer_id = ($1);";
    const result = await conn.query(sql, [id]);
    const rows = result.rows[0];
    conn.release();

    if (rows) {
      throw new Error("User already conducted test");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//get all correct answers to questions in the questions table
const getCorrectAnswers = async () => {
  try {
    //connect to database and fetch all questions and correct answer
    const conn = await pool.connect();
    const sql = "SELECT id, answer FROM questions;";
    const result = await conn.query(sql);
    const rows = result.rows;
    conn.release();

    //return questions id and correct answers
    return rows;
  } catch (error) {
    throw error;
  }
};

//check if user already conducted test session
const checkDuplicateUserSubmission = async (req) => {
  try {
    const session_id = await getSessionId(req);

    //connect to database and get session id
    const conn = await pool.connect();
    const sql = "SELECT * FROM test_results WHERE session_id = ($1);";
    const result = await conn.query(sql, [session_id]);
    const rows = result.rows[0];
    conn.release();

    if (rows) {
      throw new Error("User already conducted test");
    }
    return true;
  } catch (error) {
    throw error;
  }
};

//validate if questions selected is the same as question generated
const getSessionQuestions = async (req) => {
  try {
    const { id } = req.params;

    //connect to database and get session questions
    const conn = await pool.connect();
    const sql = "SELECT questions FROM session WHERE officer_id = ($1);";
    const result = await conn.query(sql, [id]);
    const rows = result.rows[0];
    conn.release();

    if (!rows) {
      throw new Error("User yet to conduct test");
    }
    return rows.questions;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkRecruitStatus,
  getRandomizedQuestions,
  getSessionId,
  checkDuplicateUserSession,
  getCorrectAnswers,
  checkDuplicateUserSubmission,
  getSessionQuestions,
};
