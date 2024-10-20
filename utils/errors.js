const errorCodes = {
  Server: 500,
  NotFound: 404,
  BadRequest: 400,
  DuplicateEmail: 409,
  Unauthorized: 403,
  WrongLogin: 401,
};

const errorMessages = {
  Server: "Error on server",
  notFound: "Requested Document not found",
  Cast: "Error casting request",
  Validation: "Error validating request",
  badRoute: "Unknown route request",
  DuplicateEmail: "User already exists with this email address",
  BadCredentials: "Username or password is incorrect",
  Unauthorized: "Authorization Required",
};

module.exports = { errorCodes, errorMessages };
