const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");
const { validateProduct } = require("../middlewares/validator");
const {
  addProduct,
  getProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

router.use(isAuth);

router.post("/", upload, validateProduct, addProduct);
router.get("/", getProduct);
router.get("/:id", getSingleProduct);
router.put("/:id", upload, validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
