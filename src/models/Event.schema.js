const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    date: {
      type: Number
    },
    category: {
      type: String
    },
    comments: {
      type: String,
      default: ""
    },
    amount: {
      type: Number
    },
    type: {
      type: String
    },
    balanceAfter: {
      type: Number
    },
    typeBalanceAfter: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = EventSchema;
