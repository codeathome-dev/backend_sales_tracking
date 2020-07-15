const express = require("express");
const router = express.Router();
const { signin } = require("../controllers/auth");

router.post("/signin", signin);

module.exports = router;
