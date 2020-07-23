const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { validateApotik } = require("../middlewares/validator");
const {
  addApotik,
  getApotik,
  getSingleApotik,
  updateApotik,
  deleteApotik,
} = require("../controllers/apotik");

router.use(isAuth);

router.post("/", validateApotik, addApotik);
router.get("/", getApotik);
router.get("/:id", getSingleApotik);
router.put("/:id", validateApotik, updateApotik);
router.delete("/:id", deleteApotik);

module.exports = router;
