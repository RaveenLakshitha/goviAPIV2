const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const itemSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      //required: true,
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      //required: true,
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
    /* unit: [
      {
        type: String,
        enum: ["Packet", "Kilo", "grams", "Plants", "Items"],
      },
    ], */
    rating: {
      type: Number,
      default: 0,
      //required: true,
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
    itemReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itemCategory",
      //required: true,
    },
    categoryName: { type: String },
    parentCategoryName: { type: String },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "itemCategory",
      //required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      //required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },
    ratingSum: {
      type: Number,
      //required: true,
    },

    raters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratingAvg: {
      type: Number,
      //required: true,
    },
    avilability: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    itemRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    itemVisibility: {
      type: Boolean,
      default: true,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
    updateAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
