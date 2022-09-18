const express = require("express");
const router = express.Router();

const SponsorsController = require("../controllers/sponsor");

router.get("/", SponsorsController.getSponsorsInfo);

module.exports = router;
