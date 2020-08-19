const express = require("express");
const router = express.Router();
const {
  signin,
  getTripSingleSales,
  getCartSales,
  addCartSales,
  deleteCartSales,
} = require("../controllers/sales");
const { validateAddCart } = require("../middlewares/validator");

router.post("/signin", signin);
router.get("/trip-single-sales/:sales_id", getTripSingleSales);
router.get("/cart-sales/:detailtrip_id", getCartSales);
router.post("/cart-sales/:detailtrip_id", validateAddCart, addCartSales);
router.delete("/cart-sales/:id", deleteCartSales);

module.exports = router;
