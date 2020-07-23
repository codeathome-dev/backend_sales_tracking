const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { validateUsers } = require("../middlewares/validator");
const { addUser, getUser, deleteUser } = require("../controllers/user");

router.use(isAuth);

router.post("/", validateUsers, addUser);
router.get("/", getUser);
// router.get("/:id", getSingleProduct);
// router.put("/:id", upload, validateProduct, updateProduct);
router.delete("/:user_id", deleteUser);

module.exports = router;
