const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const UserController = require("../controllers/user.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post("/register", UserController.userRegister);
router.post("/login", UserController.userLogin);
router.get("/refresh", UserController.refreshTokens);
router.get("/info", authMiddleware, UserController.userInfo);
router.put(
  "/update",
  authMiddleware,
  uploadCloud.single("avatar"),
  UserController.userUpdate
);

module.exports = router;