const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const PetController = require("../controllers/pet.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post(
  "/pet/",
  authMiddleware,
  uploadCloud.single("avatarURL"),
  PetController.petRegister
);
router.delete("/pet/:id", authMiddleware, PetController.petDelete);

module.exports = router;
