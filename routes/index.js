const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItem");
const { errorMessages } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateNewUser,
} = require("../middlewares/validation");
const { NotFoundError } = require("../middlewares/NotFoundError");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signin", validateUserLogin, login);
router.post("/signup", validateNewUser, createUser);
router.use((req, res, next) => next(new NotFoundError(errorMessages.badRoute)));

module.exports = router;
