const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const {
  addTrip,
  getTrip,
  getSingleTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/trip");

router.use(isAuth);

router.post("/", addTrip);
router.get("/", getTrip);
router.get("/:id", getSingleTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;
