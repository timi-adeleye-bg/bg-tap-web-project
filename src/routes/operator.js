//import required modules
const express = require("express");
const operatorRoute = express.Router();
const {
  createOperator,
  updateOperator,
  pictureUpload,
  productSelect,
  getProduct,
  recruitUser,
  uploadID,
} = require("../controllers/operatorController");
const { authToken } = require("../middlewares/authUser");
const multer = require("multer");

//configure storage to manage pictures uploaded on the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//store pictures in the upload folder
const upload = multer({
  storage: storage,
  onError: function (err, next) {
    console.log(err);
    next(err);
  },
});

//route to register an operator
operatorRoute.post("/register", authToken, createOperator);

//route to update operator profile
operatorRoute.put("/updateoperator", authToken, updateOperator);

//route to update operator picture
operatorRoute.put(
  "/uploadpicture",
  authToken,
  upload.single("userPicture"),
  pictureUpload
);

//route to select product and seed type for operator
operatorRoute.post("/:product_id/:seed_id", authToken, productSelect);

//route to get all products selected by an operator
operatorRoute.get("/selections", authToken, getProduct);

//route to register a field officer
operatorRoute.post("/recruit", authToken, recruitUser);

//route to update field officer picture
operatorRoute.put("/upload/:id", authToken, upload.single("idCard"), uploadID);

module.exports = operatorRoute;
