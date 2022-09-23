const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/user.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post("/register", UserController.userRegister);
router.post("/login", UserController.userLogin);
router.post("/refresh", UserController.refreshTokens);
router.get("/info", authMiddleware, UserController.userInfo);
router.patch(
  "/update",
  authMiddleware,
  uploadCloud.single("userImgUrl"),
  UserController.userUpdate
);
router.get("/logout", authMiddleware, UserController.userLogout);

module.exports = router;
