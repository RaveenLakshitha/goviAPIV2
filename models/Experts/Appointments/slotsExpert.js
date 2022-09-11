const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const appointemtSlotsSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    avialability: {
      type: String,
      enum: ["Active", "Not Active"],
      default: "Active",
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "expertAppointments",
      },
    ],
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true }
);

module.exports = mongoose.model("slotsExpert", appointemtSlotsSchema);
