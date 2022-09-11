const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const appointmentsSchema = new mongoose.Schema(
  {
    note: {
      type: String,
    },
    avialability: {
      type: String,
      enum: ["Active", "Not Active"],
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "slotsExpert",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expertAppointments", appointmentsSchema);
