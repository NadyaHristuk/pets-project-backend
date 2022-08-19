const UserFinance = require("../models/Pet.model");

module.exports.registerPet = async (req, res) => {
	const userId = req.user.id;
	const title = req.body.title;
	const description = req.body.description;
	const dates = req.body.dates;

	Tasks.create({title, description, dates, userId})
		.then(task => {
			if (task) {
				Users.findByIdAndUpdate(userId, {$push: {userTasks: task._id}})
					.then(user => {
						if (user) {
							res.status(201).json({success: true, task: task});
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

module.exports.getFinance = (req, res) => {
  const userId = req.user._id;

  UserFinance.findOne({ userId }).then(doc => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID"
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      finance: doc,
      user: { name: req.user.name, email: req.user.email }
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
