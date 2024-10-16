const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { errorMessages, errorCodes } = require("../utils/errors");

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(errorCodes.BadRequest)
      .send({ message: errorMessages.Unauthorized });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(errorCodes.BadRequest)
      .send({ message: errorMessages.Unauthorized });
  }

  req.user = payload;

  return next();
}

module.exports = auth;
