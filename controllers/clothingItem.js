const clothingItem = require("../models/clothingItem");
const { errorMessages } = require("../utils/errors");
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require("../middlewares/error-handler");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(req);
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError((err.message = errorMessages.Validation)));
      }
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== userId) {
        next(new ForbiddenError((err.message = errorMessages.Unauthorized)));
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .orFail()
        .then(() =>
          res.status(200).send({ message: "Item succesfully deleted" })
        );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError((err.message = errorMessages.notFound)));
      }
      if (err.name === "CastError") {
        next(new BadRequestError((err.message = errorMessages.Cast)));
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError((err.message = errorMessages.Cast)));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError((err.message = errorMessages.notFound)));
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError((err.message = errorMessages.Cast)));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError((err.message = errorMessages.notFound)));
      }
      next(err);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
