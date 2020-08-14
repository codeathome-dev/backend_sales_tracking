const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
// const { upload } = require("../middlewares/multer");
// const { validateProduct } = require("../middlewares/validator");
const {
  getTrip,
  getSalesOpen,
  addSalesToTrip,
} = require("../controllers/supervisor");

router.use(isAuth);

router.get("/", getTrip);
router.put("/add-sales-to-trip/:id", addSalesToTrip);
router.get("/sales-open/", getSalesOpen);

module.exports = router;
