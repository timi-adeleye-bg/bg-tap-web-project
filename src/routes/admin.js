//import required modules
const express = require("express");
const adminRoute = express.Router();
const { getOperatorRecruits } = require("../controllers/adminController");
const { authToken } = require("../middlewares/authUser");

//route to fetch all field officers of an operator
adminRoute.get("/operator/:id", authToken, getOperatorRecruits);

module.exports = adminRoute;
