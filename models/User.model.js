const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");

require("dotenv").config();

// const emailRegexp = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
// const passwordRegExp =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/;
// const phoneRegExp = /^\(\d{3}\)\s\d{3}-\d{4}$/;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
      minlength: [3, "Must be at least 3, got {VALUE}"],
      // match: /^[a-zA-Z ]+$/,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // match: emailRegexp,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: [true, "User phone number required"],
      // match: [phoneRegExp, "Must be in format (000) 000-0000"],
      unique: true,
      trim: true,
    },
    birthday: {
      type: String,
      default: null,
    },
    userImgUrl: {
      type: String,
      default: null,
    },
    userPets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Pet",
      },
    ],
    ownNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notice",
        default: [],
      },
    ],
    favoriteNotices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notice",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const joiRegisterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { deny: ["ru", "su", "рус", "рф", "москва"] } })
    .error(
      (errors) =>
        new Error(
          "enter valid email: min 6, max 63 characters, except .ru, .su, .рус, .рф,.москва etc"
        )
    )
    .min(6)
    .max(63)
    // .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .max(12)
    // .pattern(passwordRegExp)
    .error(
      (errors) =>
        new Error(
          "the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters"
        )
    )
    .required(),
  name: Joi.string()
    .min(3)
    // .pattern(/^[a-zA-Z ]+$/)
    .max(16)
    .required(),
  city: Joi.string().required(),
  phone: Joi.string().required(),
});
// Please enter email and password and name and city and phone
// Password must be at least 6 characters

const joiLoginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { deny: ["ru", "su", "рус", "рф", "москва"] } })
    .error(
      (errors) =>
        new Error(
          "enter valid email: min 6, max 63 characters, except .ru, .su, .рус, .рф,.москва etc"
        )
    )
    .min(6)
    .max(63)
    // .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .max(12)
    // .pattern(passwordRegExp)
    .error(
      (errors) =>
        new Error(
          "the passport must contain Latin letters: at least 1 lowercase, 1 uppercase, 1 number and be at least 6 and no more than 12 characters"
        )
    )
    .required(),
});

UserSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Create method to compare password input to password saved in database
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.toWeb = function () {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

const User = model("User", UserSchema);

module.exports = {
  User,
  joiRegisterSchema,
  joiLoginSchema,
};
