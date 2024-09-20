const clothingItem = require("../models/clothingItem");
const { errorCodes } = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      return res.status(errorCodes.Server).send({ message: err.message });
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
        return res.status(errorCodes.Validation).send({ message: err.message });
      }
      return res.status(errorCodes.Server).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(errorCodes.Cast).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCodes.NotFound).send({ message: err.message });
      }
      return res.status(errorCodes.Server).send({ message: err.message });
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
        return res.status(errorCodes.Cast).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCodes.NotFound).send({ message: err.message });
      }
      return res.status(errorCodes.Server).send({ message: err.message });
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
        return res.status(errorCodes.Cast).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCodes.NotFound).send({ message: err.message });
      }
      return res.status(errorCodes.Server).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
