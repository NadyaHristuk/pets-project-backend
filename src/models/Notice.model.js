const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoticeSchema = new mongoose.Schema(
  {
    type_of_pet: {
      type: String,
      required: true
    },
    animals_photos: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userContacts: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true,
      default: "free"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    enum: ["Lost/Found", "Give to good hands", "Sell"],
    },
  },
  {
    timestamps: true
  }
);

const Notice = mongoose.model("Notice", NoticeSchema);

module.exports = Notice;