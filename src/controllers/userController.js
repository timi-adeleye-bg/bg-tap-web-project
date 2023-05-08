const jwt = require("jsonwebtoken");
const {
  userSignUp,
  authUserLogin,
  userProfileUpdate,
} = require("../dao/user.dao");

//@desc Create New User
//@route POST /api/users/register
//@access public

const createUser = async (req, res) => {
  try {
    let result = await userSignUp(req);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error creating user: ", error);
    res.status(404).json(error.message);
  }
};

//@desc User Login
//@route POST /api/users/login
//@access public

const userLogin = async (req, res) => {
  try {
    let result = await authUserLogin(req);
    let token = jwt.sign({ user: result }, process.env.TOKEN_SECRET, {
      expiresIn: 3600,
    });
    res.status(201).json({ result, token });
  } catch (error) {
    console.log("Unable to Login: ", error);
    res.status(401).json(error.message);
  }
};

//@desc Update User Info
//@route PUT /api/users/login
//@access private

const updateUser = async (req, res) => {
  try {
    let result = await userProfileUpdate(req);
    res.status(201).json(result);
  } catch (error) {
    console.log("Unable to update User: ", error);
    res.status(404).json(error.message);
  }
};

module.exports = { createUser, userLogin, updateUser };
