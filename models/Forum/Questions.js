const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const Questions = mongoose.Schema(
  {
    DateAndTime: {
      type: Date,
    },
    Title: {
      type: String,
      //required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
    Category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "forumCategory",
      // required: true,
    },
    QuestionBody: {
      type: String,
      //required: true,
    },
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    Vote: {
      type: Number,
    },
    votedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    solvedStatus: {
      type: Boolean,
    },
    downvotedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    Answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answers",
      },
    ],
    AnswerCount: {
      type: Number,
    },
    slug: String,
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Questions", Questions);
