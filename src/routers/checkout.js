const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");

const { getAllOrder, getDetailOrder } = require("../controllers/checkout");

router.use(isAuth);
router.get("/", getAllOrder);
router.get("/:id", getDetailOrder);

module.exports = router;
