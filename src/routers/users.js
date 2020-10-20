const router = require("express").Router();
const { isAuth } = require("../middlewares/auth");
const { validateUsers } = require("../middlewares/validator");
const {
  addUser,
  getUser,
  deleteUser,
  getSingleUser,
  updateUser,
} = require("../controllers/User");

const { upload } = require("../middlewares/multer");

router.use(isAuth);

router.post("/", upload, validateUsers, addUser);
router.get("/", getUser);
router.get("/:id", getSingleUser);
router.put("/:id", upload, updateUser);
router.delete("/:user_id", deleteUser);

module.exports = router;
