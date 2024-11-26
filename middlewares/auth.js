const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { errorMessages, errorCodes } = require("../utils/errors");
const { UnathorizedError } = require("./error-handler");

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(errorCodes.WrongLogin)
      .send({ message: errorMessages.Unauthorized });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnathorizedError(errorMessages.Unauthorized));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
