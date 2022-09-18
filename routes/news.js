const express = require("express");
const router = express.Router();

const NewsController = require("../controllers/news.js");

router.get("/", NewsController.getNews);

module.exports = router;
