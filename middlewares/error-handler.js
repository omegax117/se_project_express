const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.error(err);
  res.status(statusCode).send({ message });
};

// class BadRequestError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 400;
//   }
// }
// class UnathorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 401;
//   }
// }
// class ForbiddenError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 403;
//   }
// }
// class NotFoundError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 404;
//   }
// }
// class ConflictError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 409;
//   }
// }

module.exports = {
  errorHandler,
};
