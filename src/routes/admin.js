//import required modules
const express = require("express");
const adminRoute = express.Router();
const {
  getOperatorRecruits,
  conductAssessment,
  submitAssessment,
} = require("../controllers/adminController");
const { authToken } = require("../middlewares/authUser");

//route to fetch all field officers of an operator
adminRoute.get("/operator/:id", authToken, getOperatorRecruits);

//route to generate list of questions for assessment
adminRoute.get("/questions/:user_id", authToken, conductAssessment);

//route to conduct assessment
adminRoute.post("/answers/:user_id", authToken, submitAssessment);

module.exports = adminRoute;
