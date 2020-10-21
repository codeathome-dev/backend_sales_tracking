const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { validateApotik } = require("../middlewares/validator");
const { upload } = require("../middlewares/multer");
const {
    addRadius, getRadius
} = require("../controllers/radius");

router.use(isAuth);

router.post("/", addRadius);
router.get("/", getRadius);

module.exports = router;
