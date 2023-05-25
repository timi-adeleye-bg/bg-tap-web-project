//import required modules
const {
  getOperatorFieldOfficers,
  conductTestSession,
  submitTestSession,
} = require("../dao/admin.dao");

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

//@desc Generate Random Questions for test
//@route GET /api/admin/questions/:id
//@access private

const conductAssessment = async (req, res) => {
  try {
    let result = await conductTestSession(req);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(404).json(error.message);
  }
};

//@desc Conduct assessment for Field officer
//@route POST /api/admin/assessment/:id
//@access private

const submitAssessment = async (req, res) => {
  try {
    let result = await submitTestSession(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = { getOperatorRecruits, conductAssessment, submitAssessment };
