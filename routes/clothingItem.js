const router = require("express").Router();
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

router.post("/", validateClothingItem, auth, createItem);
router.get("/", getItems);
router.delete("/:itemId", validateId, auth, deleteItem);
router.put("/:itemId/likes", validateId, auth, likeItem);
router.delete("/:itemId/likes", validateId, auth, dislikeItem);

module.exports = router;
