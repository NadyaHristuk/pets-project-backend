const sponsors = require("../data/sponsors.json");

// Get SponsorsInfo data
module.exports.getSponsorsInfo = (req, res) => {
  res.status(200).json(sponsors);
};
