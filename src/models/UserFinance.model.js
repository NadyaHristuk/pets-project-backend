const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = require("./Event.schema");

const UserFinanceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    data: [EventSchema],
    totalBalance: {
      type: Number
    },
    typeTotalBalance: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const UserFinance = mongoose.model("UserFinance", UserFinanceSchema);

module.exports = UserFinance;
