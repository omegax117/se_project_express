const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItem");
const { errorCodes, errorMessages } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signin", login);
router.post("/signup", createUser);
router.use((req, res) =>
  res.status(errorCodes.NotFound).send({ message: errorMessages.badRoute })
);

module.exports = router;
