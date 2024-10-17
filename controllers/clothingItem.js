const clothingItem = require("../models/clothingItem");
const { errorCodes, errorMessages } = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(req);
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
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

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== userId) {
        return res
          .status(errorCodes.Unauthorized)
          .send({ message: errorMessages.Unauthorized });
      }
      return res
        .status(errorCodes.Server)
        .send({ message: errorMessages.Server });
    });
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item succesfully deleted" }))
    .catch((err) => {
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

const likeItem = (req, res) => {
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
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Cast });
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

const dislikeItem = (req, res) => {
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
        return res
          .status(errorCodes.BadRequest)
          .send({ message: errorMessages.Cast });
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
