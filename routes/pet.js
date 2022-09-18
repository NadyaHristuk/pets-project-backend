const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const PetController = require("../controllers/pet.js");
const uploadCloud = require("../middlewares/uploadMiddleware.js");

router.post(
  "/",
  authMiddleware,
  uploadCloud.single("image"),
  PetController.petRegister
);

router.delete("/:id", authMiddleware, PetController.petDelete);

module.exports = router;
