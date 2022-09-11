const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const appointmentsSchema = new mongoose.Schema({
  note: {
    type: String,
  },
  avialability: {
    type: String,
    enum: ["Active", "Not Active"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "architectAppointemtSlots",
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
});

module.exports = mongoose.model("ArchitectAppointments", appointmentsSchema);
