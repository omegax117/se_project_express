const User = require("../models/user");
const { errorCodes, errorMessages } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Validation });
      }
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCodes.NotFound)
          .send({ message: errorMessages.notFound });
      }
      if (err.name === "CastError") {
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Cast });
      }
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

module.exports = { getUsers, createUser, getUser };
