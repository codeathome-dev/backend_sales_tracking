const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
// const { validateApotik } = require("../middlewares/validator");
const { addTrip, getTrip } = require("../controllers/trip");

router.use(isAuth);

router.post("/", addTrip);
router.get("/", getTrip);
// router.get("/:id", getSingleApotik);
// router.put("/:id", validateApotik, updateApotik);
// router.delete("/:id", deleteApotik);

module.exports = router;
