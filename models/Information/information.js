const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const information = mongoose.Schema(
  {
    Title: {
      type: String,
    },
    ScientificName: {
      type: String,
    },
    Family: {
      type: String,
    },
    Description: {
      type: String,
    },
    Articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    categoryId: {
      type: String,
      ref: "infoCategory",
      //required: true,
    },
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    infoVisibility: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Information", information);
