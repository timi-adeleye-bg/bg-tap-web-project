//import required modules
const { getOperatorFieldOfficers } = require("../dao/admin.dao");

//@desc Fetch all Field Officers of an Operator
//@route GET /api/admin/operator/:id
//@access private

const getOperatorRecruits = async (req, res) => {
  try {
    let result = await getOperatorFieldOfficers(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = { getOperatorRecruits };
