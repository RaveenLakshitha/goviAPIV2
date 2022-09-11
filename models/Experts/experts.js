const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
jwt = require("jsonwebtoken");
const slugify = require("slugify");
const expertSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      min: 3,
      max: 20,
      // required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: String,
    email: {
      type: String,
      unique: true,
      //required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      //required: [true, "Please add a Address"],
      min: 6,
      max: 10,
      select: false,
    },
    city: {
      type: String,
      //required: true,
      trim: true,
    },
    description: {
      type: String,
      //required: true,
      trim: true,
    },
    Qualification: {
      type: String,
      //required: true,
      trim: true,
    },
    designation: {
      type: String,
      //required: true,
    },
    contactNumber: {
      type: String,
      //required: true,
      minlength: 9,
      trim: true,
    },
    expertReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    expertRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingExpert",
      },
    ],
    appointmentSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "slotsExpert",
      },
    ],
    ratingSum: {
      type: Number,
      //required: true,
    },
    raters: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    mentions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
    },
    rating: {
      type: Number,
      default: 0,
      //required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    proofDocuments: [
      {
        img: { type: String },
      },
    ],
    expertVisibility: {
      /* type: Boolean,
      default: false, */
      type: String,
      enum: ["Active", "Pending", "Suspend", "Decline", "Inactive"],
      default: "Pending",
    },
    profilePicture: { type: String },
    ProofOfQualification: { type: String },
    Expertin: {
      type: String,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    toObject: { virtuals: true },
    toJson: { virtuals: true },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Expert", expertSchema);
