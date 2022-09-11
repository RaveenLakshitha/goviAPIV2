const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      //required: true,
    },
    description: {
      type: String,
      trim: true,
      //required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    projectPictures: [
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
    rating: {
      type: Number,
      //required: true,
    },
    designTeam: [
      {
        memberName: {
          type: String,
        },
      },
    ],
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
