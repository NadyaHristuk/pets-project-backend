const Notice = require("../models/Notice.model");
const { User } = require("../models/User.model");

module.exports.noticeCategory = (req, res) => {
  Notice.find().then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found notice data with this user ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "found notice data with this user ID",
      notice: doc,
      category: ["lost-found", "for-free", "sell"],
    });
  });
};

module.exports.noticeCreate = (req, res) => {
  const owner = req.user._id;
  const noticeData = req.body;
  const data = req.file
    ? { imageUrl: req.file.path, owner, ...noticeData }
    : { owner, ...noticeData };
  Notice.create(data)
    .then((notice) => {
      if (notice) {
        User.findByIdAndUpdate(
          owner,
          { $push: { ownNotices: notice._id } },
          { new: true }
        )
          .then((user) => {
            if (user) {
              res.status(201).json({ success: true, notice });
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    })
    .catch((err) =>
      res.status(400).json({ success: false, error: err, message: err.message })
    );
};

module.exports.noticeDelete = (req, res) => {
  const owner = req.user._id;

  Notice.findByIdAndRemove(req.params.id).then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found notice with this ID",
      });
    } else {
      User.findByIdAndUpdate(
        owner,
        { $pull: { ownNotices: req.params.id } },
        { new: true }
      )
        .then((user) => {
          if (user) {
            res.status(201).json({ success: true, notice: doc });
          }
        })
        .catch((err) => {
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

module.exports.noticeOfUser = (req, res) => {
  const limit = req.limit;
  const owner = req.user._id;
  Notice.find({ owner }, null, { limit }).then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      noticeOfUser: doc,
    });
  });
};

module.exports.noticeByID = (req, res) => {
  Notice.findOne({ _id: req.params.id }).then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found finance data with this user ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data found with this ID",
      noticeByID: doc,
    });
  });
};

module.exports.noticeSelected = (req, res) => {
  const owner = req.user._id;

  User.findById(owner, { favoriteNotices: 1 })
    .populate("favoriteNotices")
    .then((doc) => {
      const { favoriteNotices } = doc;
      if (favoriteNotices.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Not found selected notice of user",
        });
      }

      res.status(200).json({
        success: true,
        favoriteNotices,
      });
    });
};

module.exports.noticeSelectedCreate = (req, res) => {
  const owner = req.user._id;

  Notice.findById(req.params.id)
    .then((notice) => {
      if (!notice) {
        res.status(400).json({
          success: false,
          message: "Not found notice with this ID",
        });
      } else {
        User.findByIdAndUpdate(
          owner,
          { $push: { favoriteNotices: notice._id } },
          { new: true }
        )
          .then((user) => {
            if (user) {
              res.status(201).json({ success: true, notice });
            }
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    })
    .catch((err) =>
      res.status(400).json({ success: false, error: err, message: err.message })
    );
};

module.exports.noticeSelectedDelete = (req, res) => {
  const owner = req.user._id;

  Notice.findById(req.params.id).then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found notice with this ID",
      });
    } else {
      User.findByIdAndUpdate(
        owner,
        { $pull: { favoriteNotices: req.params.id } },
        { new: true }
      )
        .then((user) => {
          if (user) {
            res.status(201).json({ success: true, notice: doc });
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  });
};
