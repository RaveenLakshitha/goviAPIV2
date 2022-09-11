const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const appointemtSlotsSchema = new mongoose.Schema({
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
    /* match: [
        /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/,
        "Please add time in 24 hrs",
      ], */
  },
  avialability: {
    type: String,
    enum: ["Active", "Not Active"],
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArchitectAppointments",
    },
  ],
  architectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Architect",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
});

module.exports = mongoose.model(
  "architectAppointemtSlots",
  appointemtSlotsSchema
);
