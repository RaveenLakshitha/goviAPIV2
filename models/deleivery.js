const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const deliveries = new mongoose.Schema(
  {
    profileName: {
      type: String,
    },
    link: {
      type: String,
    },
    slug: String,
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("deliveries", deliveries);
