const pool = require("./src/database/dbConfig");

//random elements
const getRandomElements = (array, count) => {
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, count);
};

//fetch randomized questions
const fetchRandomizedQuestions = async () => {
  try {
    const conn = await pool.connect();
    const sql = "SELECT id, question, category, options FROM questions;";
    const result = await conn.query(sql);
    const questions = result.rows;
    conn.release();

    //randomize questions
    const randomizedQuestions = [];
    const categories = ["A", "B", "C"];

    for (const category of categories) {
      const categoryQuestions = questions.filter(
        (question) => question.category === category
      );
      const randomizedCategoryQuestions = getRandomElements(
        categoryQuestions,
        5
      );
      randomizedQuestions.push(...randomizedCategoryQuestions);
    }

    console.log(randomizedQuestions);
  } catch (error) {
    console.error("Error fetching and randomizing questions:", error);
  }
};

console.log(fetchRandomizedQuestions());
