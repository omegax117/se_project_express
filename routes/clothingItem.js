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

router.post("/", auth, validateClothingItem, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validateId, deleteItem);
router.put("/:itemId/likes", auth, validateId, likeItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
