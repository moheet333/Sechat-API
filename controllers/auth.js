const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");
const supabase = require("../db/connect");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new BadRequestError("Please pass all fields");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  // insert data
  const { data, error } = await supabase
    .from("user")
    .insert({ username: username, email: email, password: password })
    .select();
  // generate token
  const token = jwt.sign(
    { userId: data[0].id, username: data[0].username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  res.status(StatusCodes.CREATED).json({
    user: {
      username: data[0].username,
      token,
    },
  });
};

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    throw new BadRequestError("Please pass all fields");
  }
  const { data, error } = await supabase
    .from("user")
    .select()
    .or(`email.eq.${identifier},username.eq.${identifier}`);
  if (!data) {
    throw new UnauthenticatedError("Invalid username/email");
  }
  const isPasswordCorrect = await bcrypt.compare(password, data[0].password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Ivalid password");
  }

  const token = jwt.sign(
    { userId: data[0].id, username: data[0].username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );

  res.status(StatusCodes.OK).json({
    user: {
      username: data[0].username,
      token,
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
};
