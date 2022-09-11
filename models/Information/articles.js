const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const article = mongoose.Schema(
  {
    Title: { type: String },
    Description: { type: String },
    infoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Information",
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", article);
