//Function to validate keys passed in by client
const requiredKeys = (req, keys) => {
  for (const key in req.body) {
    if (!keys.includes(key)) {
      throw new Error(`${key} not expected. Only ${keys} are valid input`);
    }
  }
  return true;
};

module.exports = { requiredKeys };
