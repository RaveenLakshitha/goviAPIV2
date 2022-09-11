const mongoose = require("mongoose");
const slugify = require("slugify");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const rentItemsCategorytSchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    image: { type: String },
    slug: String,
    parentId: {
      type: String,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    categoryType: {
      type: String,
      enum: ["Main", "Sub", "Sub1", "Sub2"],
      //required: true,
    },
    SubCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rentItemsCategory",
      },
    ],
    Items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RentItems",
      },
    ],
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);
// Create users slugify from name
rentItemsCategorytSchema.pre("save", function (next) {
  this.slug = slugify(this.categoryName, { lower: true });
  next();
});
module.exports = mongoose.model("rentItemsCategory", rentItemsCategorytSchema);
