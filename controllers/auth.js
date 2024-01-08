const { BadRequestError } = require("../errors");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("Please pass all fields");
  }
};

module.exports = {
  registerUser,
};
