const express = require("express");
const userRoute = express.Router();
const {
  createUser,
  userLogin,
  updateUser,
} = require("../controllers/userController");
const { authToken } = require("../middlewares/authUser");

//route to register user
userRoute.post("/register", createUser);

//route to login a user
userRoute.post("/login", userLogin);

//route to update user
userRoute.put("/update", authToken, updateUser);

module.exports = userRoute;
