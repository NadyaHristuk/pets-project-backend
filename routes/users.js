const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/user.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post("/user/register", UserController.userRegister);
router.post("/user/login", UserController.userLogin);
router.get("/user/refresh", UserController.refreshTokens);
router.get("/user/info", authMiddleware, UserController.userInfo);
router.put(
  "/user/update",
  authMiddleware,
  uploadCloud.single("avatar"),
  UserController.userUpdate
);

module.exports = router;
