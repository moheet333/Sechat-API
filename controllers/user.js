const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const supabase = require("../db/connect");

const searchUsers = async (req, res) => {
  const { searchUser } = req.body;
  if (!searchUser) {
    throw new BadRequestError("Invalid credentials");
  }
  const { data, error } = await supabase
    .from("user")
    .select()
    .textSearch("username", `${searchUser}`);
  res.status(StatusCodes.OK).json({
    users: data,
  });
};

module.exports = {
  searchUsers,
};
