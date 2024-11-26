const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { errorMessages } = require("../utils/errors");
const {
  BadRequestError,
  ConflictError,
  UnathorizedError,
} = require("../middlewares/error-handler");

const createUser = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        next(new BadRequestError((err.message = errorMessages.Validation)));
      }
      if (err.code === 11000) {
        next(new ConflictError((err.message = errorMessages.DuplicateEmail)));
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new BadRequestError((err.message = errorMessages.notFound)));
      }
      if (err.name === "CastError") {
        next(new BadRequestError((err.message = errorMessages.Cast)));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new UnathorizedError((err.message = errorMessages.BadCredentials)));
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
        next(new BadRequestError((err.message = errorMessages.BadCredentials)));
      }
      if (err.message === "Incorrect email or password") {
        next(
          new UnathorizedError((err.message = errorMessages.BadCredentials))
        );
      }
      next(err);
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
        next(new BadRequestError((err.message = errorMessages.Validation)));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new BadRequestError((err.message = errorMessages.notFound)));
      }
      next(err);
    });
};

module.exports = { createUser, login, getCurrentUser, updateUser };
