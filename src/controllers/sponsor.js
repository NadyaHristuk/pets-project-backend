const sponsors = require("../../data/sponsors.json");

// Get User data by Id
module.exports.getSponsorsInfo = (req, res) => {
  res.status(200).json(sponsors);
};