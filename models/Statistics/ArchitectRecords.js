const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const ArchitectRecords = new mongoose.Schema(
  {
    architect: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architect",
    },
    numofAppointments: {
      type: Number,
      default: 1,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArchitectRecords", ArchitectRecords);
