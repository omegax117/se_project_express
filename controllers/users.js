const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { errorCodes, errorMessages } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, email, password, avatar } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const error = new Error("Email Taken");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((newpass) =>
      User.create({ name, email, password: newpass, avatar }).then(() =>
        res.status(201).send({ name, email, avatar })
      )
    )
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Validation });
      }
      if (err.code === 11000) {
        return res
          .status(errorCodes.DuplicateEmail)
          .send({ message: errorMessages.DuplicateEmail });
      }
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(errorCodes.BadRequest)
      .send({ message: errorMessages.BadCredentials });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return token;
    })
    .then((token) => res.status(200).send({ token }))
    .catch((err) => {
      if (err.message === errorMessages.BadCredentials) {
        return res
          .status(errorCodes.WrongLogin)
          .send(errorMessages.BadCredentials);
      }
      if (err.message === "Incorrect email or password") {
        return res
          .status(errorCodes.WrongLogin)
          .send({ message: errorMessages.BadCredentials });
      }
      console.log(err);
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then(() => res.status(200).send({ name, avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Validation });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCodes.NotFound)
          .send({ message: errorMessages.notFound });
      }
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
