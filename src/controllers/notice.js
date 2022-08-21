const Notice = require("../models/Notice.model");
const User = require("../models/User.model");


module.exports.noticeCategory = (req, res) => { 

  Notice.find().then(doc => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID"
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      finance: doc
     
    });
  });
};

module.exports.noticeCreate = async (req, res) => {
	const owner = req.user._id;
	const noticeData = req.body;


	Notice.create({ animals_photos: req.file.path, owner, ...noticeData})
		.then(notice => {
			if (notice) {
				User.findByIdAndUpdate(owner, {$push: {userNotices: notice._id}})
					.then(user => {
						if (user) {
							res.status(201).json({success: true, notice});
						}
					})
					.catch(err => {
						throw new Error(err);
					});
			}
		})
		.catch(err =>
			res.status(400).json({success: false, error: err, message: err.message})
		);
};

module.exports.noticeDelete = (req, res) => {
  const owner = req.user._id;

  Notice.findByIdAndRemove(req.params.i).then(doc => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found notice with this ID"
      });
    } else {
      User.findByIdAndUpdate(owner, { $pull: { "userNotices":  req.params.id } })
					.then(user => {
						if (user) {
							res.status(201).json({success: true, pet});
						}
					})
					.catch(err => {
						throw new Error(err);
					});
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
     notice: doc,
      
    });
  });
};

module.exports.saveFinance = (req, res) => {
  const userId = req.user._id;

  const newData = {
    date: req.body.date,
    type: req.body.type,
    category: req.body.category,
    comments: req.body.comments,
    amount: req.body.amount,
    balanceAfter: req.body.balanceAfter,
    typeBalanceAfter: req.body.typeBalanceAfter
  };

  UserFinance.findOneAndUpdate(
    { userId },
    {
      $push: { data: newData },
      totalBalance: newData.balanceAfter,
      typeTotalBalance: newData.typeBalanceAfter
    },
    { new: true, upsert: true }
  ).then((doc, err) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID"
      });
    }
    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      user: { name: req.user.name, email: req.user.email },
      finance: doc
    });
  });
};