const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const advertisement = mongoose.Schema({
  Title: {
    type: String,
    //required: true,
  },
  image: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Description: {
    type: String,
    //required: true,
  },
  Payment: {
    type: Number,
    //required: true,
  },
  Paid: {
    type: Boolean,
    enum: [true, false],
    default: false,
    //required: true,
  },
  advertisementVisibility: {
    type: String,
    enum: ["Active", "Pending", "Suspend", "Decline", "Inactive"],
    default: "Pending",
  },
  DateAndTime: {
    type: Date,
    default: Date.now,
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
});

module.exports = mongoose.model("Advertisement", advertisement);
