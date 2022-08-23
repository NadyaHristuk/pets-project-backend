const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthday: {
      type: String,
      default: null,
    },
    userImgUrl: {
      type: String,
    },
    userPets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    userNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notice",
      },
    ],
    userSelectedNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notice",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre("save", function (next){
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt)  {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
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
      process.env.ACCESS_TOKEN_SECRET.jwt_encryption
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


