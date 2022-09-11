const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const rentItemsSchema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      //required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      //required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rentItemsCategory",
      //required: true,
    },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rentItemsCategory",
      //required: true,
    },
    AvailableTime: {
      type: String,
      required: true,
    },
    Availability: {
      type: String,
      enum: ["Available", "NotAvailable"],
    },
    ratingAvg: {
      type: Number,
      //required: true,
    },
    itemReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    avilability: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    thumbnail: [
      {
        img: { type: String },
      },
    ],
    productPictures: [
      {
        img: { type: String },
      },
    ],
    NoOfDays: {
      type: String,
      required: true,
    },
    RentFee: {
      type: String,
      required: true,
    },
    Task: {
      type: String,
      required: true,
    },
    ShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },
    shopRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingShop",
      },
    ],
    rating: {
      type: Number,
      //required: true,
    },
    itemRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    raters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratingSum: {
      type: Number,
      //required: true,
    },
    ratersNo: {
      type: Number,
      //required: true,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
    slug: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("RentItems", rentItemsSchema);
