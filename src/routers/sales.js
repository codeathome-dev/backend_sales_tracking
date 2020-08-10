const express = require("express");
const router = express.Router();
const { signin } = require("../controllers/sales");

router.post("/signin", signin);

module.exports = router;
