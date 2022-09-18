const express = require("express");
const router = express.Router();

const NewsController = require("../controllers/news.js");

router.get("/news", NewsController.getNews);

module.exports = router;
