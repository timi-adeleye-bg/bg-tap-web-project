//import required modules
const pool = require("../database/dbConfig");
const { getUserRole } = require("../services/userservices");
const {
  checkRecruitStatus,
  getRandomizedQuestions,
  getCorrectAnswers,
  checkDuplicateUserSession,
  getSessionId,
  checkDuplicateUserSubmission,
  getSessionQuestions,
} = require("../services/adminservices");

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

//obtain number of test session by field_officer
const conductTestSession = async (req) => {
  try {
    //obtain user_id from params
    const { id } = req.params;

    //validate if field officer is recruited and obtain operator id
    const operator_id = await checkRecruitStatus(req);

    //validate if user already conducted test
    await checkDuplicateUserSession(req);

    //get questions for test session
    const questions = await getRandomizedQuestions(req);
    const questionIds = questions.map((question) => question.id);

    //connect to database and count the number of test session by a field officer
    const conn = await pool.connect();
    const sql =
      "INSERT INTO session(officer_id, operator_id, questions) VALUES($1, $2, $3) RETURNING *;";
    const result = await conn.query(sql, [id, operator_id, questionIds]);
    const rows = result.rows[0];
    conn.release();

    //return questions generated if session was created
    console.log(rows);
    return questions;
  } catch (error) {
    throw error;
  }
};

//conduct assessment for field officers and return assessment score
const submitTestSession = async (req) => {
  try {
    //obtain field officers answers based on questions asked and user id as param
    const { answers } = req.body;

    //validate if user is an admin to complete action
    const role = await getUserRole(req);
    if (role !== "admin") {
      throw new Error("You can not complete operation");
    }

    //validates if user already submitted test
    await checkDuplicateUserSubmission(req);

    //obtain the questions id and field officer answers and store in questions and answers column
    const questions = answers.map((test) => test.id);
    const choices = answers.map((test) => test.answer);
    console.log(questions);

    //obtain the current test session for the field officer
    const session_id = await getSessionId(req);

    //get session questions
    const sessionQuestions = await getSessionQuestions(req);
    console.log(sessionQuestions);

    //validate questions
    for (let i = 0; i < sessionQuestions.length; i++) {
      if (questions[i] !== sessionQuestions[i]) {
        throw new Error("Question not valid");
      }
    }

    //obtain field officer score
    let res = 0;
    const correct_answers = await getCorrectAnswers();

    //loop through correct answers and check if field officer choice of answer is correct
    for (let i = 0; i < answers.length; i++) {
      const FO_choice = answers[i];

      const assessment = correct_answers.find(
        (test) => test.id === FO_choice.id
      );
      if (assessment) {
        if (FO_choice.answer === assessment.answer) {
          res += 1;
        }
      } else {
        throw new Error("Question type invalid");
      }
    }

    //obtain field officer score
    const score = res;

    //connect to database and store values for field officer
    const conn = await pool.connect();
    const sql =
      "INSERT INTO test_results(session_id, question_ids, answers, score) VALUES($1, $2, $3, $4) RETURNING *;";
    const values = [session_id, questions, choices, score];
    const result = await conn.query(sql, values);
    const rows = result.rows[0];
    conn.release();

    console.log("Test successfully conducted");
    console.log(rows);
    return `You obtained a score of ${rows.score} out of ${answers.length} questions`;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOperatorFieldOfficers,
  conductTestSession,
  submitTestSession,
};
