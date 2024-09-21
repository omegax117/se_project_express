const router = require("express").Router();
const userRouter = require("./users");
const clothingRouter = require("./clothingItem");
const { errorCodes, errorMessages } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.use((req, res) =>
  res.status(errorCodes.BadRequest).send({ message: errorMessages.badRoute })
);

module.exports = router;
