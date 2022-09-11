const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const Answers = mongoose.Schema(
  {
    AnswerBody: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    DateAndTime: {
      type: Date,
    },
    QuestionId: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    Tags: {
      type: String,
    },
    AnswerVote: {
      type: Number,
    },
    votedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    downvotedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
    slug: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Answers", Answers);
