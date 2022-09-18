const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoticeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["lost-found", "for-free", "sell"],
    },
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: null,
    },
    birthday: {
      type: String,
      default: null,
    },
    breed: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userPhone: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model("Notice", NoticeSchema);

module.exports = Notice;
