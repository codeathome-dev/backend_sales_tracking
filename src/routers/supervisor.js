const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
// const { upload } = require("../middlewares/multer");
// const { validateProduct } = require("../middlewares/validator");
const {
  getTrip,
  getSalesOpen,
  addSalesToTrip,
  getDetailSalesTrip,
  deleteDetailTrip,
} = require("../controllers/supervisor");

router.use(isAuth);

router.get("/", getTrip);
router.post("/add-sales-to-trip/:trip_id", addSalesToTrip);
router.get("/sales-open/", getSalesOpen);
router.get("/show-detail-trip/:trip_id", getDetailSalesTrip);
router.delete("/delete-sales-to-trip/:id", deleteDetailTrip);

module.exports = router;
