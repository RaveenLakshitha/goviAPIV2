const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const UserRecords = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  registeredAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
  actionBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: {
    type: String,
    enum: [create],
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
  slug: String,
});

module.exports = mongoose.model("UserRecords", UserRecords);
