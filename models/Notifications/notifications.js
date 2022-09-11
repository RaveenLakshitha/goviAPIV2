const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const notification = mongoose.Schema({
  Title: {
    type: String,
    //required: true,
  },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sendBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Description: {
    type: String,
    //required: true,
  },
  status: {
    type: String,
    enum: ["Sent", "NotSent", "Disabaled"],
    default: "NotSent",
  },
  DateAndTime: {
    type: Date,
    default: Date.now,
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
});

module.exports = mongoose.model("Notification", notification);
