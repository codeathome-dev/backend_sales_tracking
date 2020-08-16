const express = require("express");
const router = express.Router();
const { signin, getTripSingleSales } = require("../controllers/sales");

router.post("/signin", signin);
router.get("/trip-single-sales/:sales_id", getTripSingleSales);

module.exports = router;
