const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const advertisements = new mongoose.Schema(
  {
    profileName: {
      type: String,
      min: 3,
      max: 20,
      required: true,
      trim: true,
    },
    shopName: {
      type: String,
      min: 3,
      max: 20,
      required: true,
      trim: true,
    },
    slug: String,
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("advertisements", advertisements);
