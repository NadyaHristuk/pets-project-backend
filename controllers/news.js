const news = require("../data/news.json");

// Get News data
module.exports.getNews = (req, res) => {
  res.status(200).json(news);
};
