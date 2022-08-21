const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CONFIG = require("../../config/config");
const Schema = mongoose.Schema;
const Notice = require("../models/Notice.model");
const Pet = require("../models/Pet.model");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    city: {
      type: String,
      // required: true
    },
    phone: {
      type: String,
      // required: true
    },
    birthday: {
      type: String,
      default: null
    },
    userImgUrl: {
      type: String
    },
    userPets: [{
      type: Schema.Types.ObjectId,
      ref: 'Pet',
    }],
    userNotices: [{
      type: Schema.Types.ObjectId,
      ref: 'Notice',
    }]
  },
  {
    timestamps: true
  }
);

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre("save", function(next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function(pw, cb) {
  bcrypt.compare(pw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    return cb(null, isMatch);
  });
};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSalt(10), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getJWT = function() {
  return (
    "JWT " +
    jwt.sign(
      {
        user_id: this._id
      },
      CONFIG.jwt_encryption
    )
  );
};

UserSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
