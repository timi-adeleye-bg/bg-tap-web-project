const {
  operatorSignUp,
  operatorUpdate,
  uploadPicture,
  selectProduct,
  getOperatorSelections,
} = require("../dao/operator.dao");

//@desc Create New Operator
//@route POST /api/operator/register
//@access private

const createOperator = async (req, res) => {
  try {
    let result = await operatorSignUp(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Create New Operator
//@route PUT /api/operator/updateoperator
//@access private

const updateOperator = async (req, res) => {
  try {
    let result = await operatorUpdate(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Update Operator Picture
//@route PUT /api/operator/updatepicture
//@access private

const pictureUpload = async (req, res) => {
  try {
    console.log(req.file);
    let result = await uploadPicture(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//@desc Select Product and Seed type
//@route POST /api/operator/:product_id/:seedId
//@access private

const productSelect = async (req, res) => {
  try {
    let result = await selectProduct(req);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }
};

//@desc Fetch Operator selections
//@route GET /api/operator/selection
//@access private

const getProduct = async (req, res) => {
  try {
    let result = await getOperatorSelections(req);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }
};

module.exports = {
  createOperator,
  updateOperator,
  pictureUpload,
  productSelect,
  getProduct,
};
