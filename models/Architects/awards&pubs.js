const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const awardsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      //required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    gallery: [
      {
        img: { type: String },
      },
    ],
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architect",
      //required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Awards", awardsSchema);
