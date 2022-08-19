const news = require("../../data/news.json");

// Get User data by Id
module.exports.getNews = (req, res) => {
  res.status(200).json(news);
};

