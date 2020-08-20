const express = require("express");
const router = express.Router();
const {
  signin,
  getTripSingleSales,
  getCartSales,
  addCartSales,
  deleteCartSales,
  addSalestoApotik,
} = require("../controllers/sales");
const {
  validateAddCart,
  validateAddCheckout,
} = require("../middlewares/validator");
const { upload } = require("../middlewares/multer");

router.post("/signin", signin);
router.get("/trip-single-sales/:sales_id", getTripSingleSales);
router.get("/cart-sales/:detailtrip_id", getCartSales);
router.post("/cart-sales/:detailtrip_id", validateAddCart, addCartSales);
router.delete("/cart-sales/:id", deleteCartSales);
router.post(
  "/checkout/:detailtrip_id",
  upload,
  validateAddCheckout,
  addSalestoApotik
);

module.exports = router;
