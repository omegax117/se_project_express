const errorCodes = {
  Server: 500,
  NotFound: 404,
  BadRequest: 400,
};

const errorMessages = {
  Server: "Error on server",
  notFound: "Requested Document not found",
  Cast: "Error casting request",
  Validation: "Error validating request",
  badRoute: "Unknown route request",
};

module.exports = { errorCodes, errorMessages };
