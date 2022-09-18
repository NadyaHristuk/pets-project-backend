const Pet = require("../models/Pet.model");
const { User } = require("../models/User.model");

module.exports.petRegister = async (req, res) => {
  const owner = req.user.id;
  const petData = req.body;
  const data = !!req.file
    ? { avatarURL: req.file.path, owner, ...petData }
    : { owner, ...petData };

  Pet.create(data)
    .then((pet) => {
      if (pet) {
        User.findByIdAndUpdate(owner, { $push: { userPets: pet._id } })
          .then((user) => {
            if (user) {
              res.status(201).json({ success: true, pet });
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

module.exports.petDelete = (req, res) => {
  const owner = req.user._id;

  Pet.findByIdAndRemove(req.params.id).then((doc) => {
    if (!doc) {
      res.status(400).json({
        success: false,
        message: "Not found pet with this ID",
      });
    } else {
      User.findByIdAndUpdate(owner, { $pull: { userPets: req.params.id } })
        .then((user) => {
          if (user) {
            res.status(201).json({ success: true, pet: doc });
          }
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  });
};

