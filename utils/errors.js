const errorCodes = {
  Server: 500,
  NotFound: 404,
  Cast: 400,
  Validation: 400,
};

const errorMessages = {
  Server: "Error on server",
  notFound: "Requested Document not found",
  Cast: "Error casting request",
  Validation: "Error validating request",
};

module.exports = { errorCodes, errorMessages };
