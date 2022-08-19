const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PetSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    birth_date: {
      type: Date,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    avatarURL: {
      type: String
    },
    comments: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;
