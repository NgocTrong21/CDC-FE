const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  const userData = {
    email: user.email,
    id: user.id,
    role_id: user.role_id,
  };
  let access_token = jwt.sign(
    { data: userData },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );
  let refresh_token = jwt.sign(
    { data: userData },
    process.env.REFRESH_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    }
  );
  return { access_token, refresh_token };
};

const verifyJwt = (token, secret) => {
  try {
    let verify = jwt.verify(token, secret);
    return verify;
  } catch (error) {
    return error;
  }
};

const verifyAccessToken = (access_token) =>
  verifyJwt(access_token, process.env.ACCESS_TOKEN_SECRET);
const verifyRefreshToken = (refresh_token) =>
  verifyJwt(refresh_token, process.env.REFRESH_TOKEN_SECRET);

module.exports = {
  generateToken,
  verifyAccessToken,
  verifyRefreshToken,
};
