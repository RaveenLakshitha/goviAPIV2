const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      //required: true,
      min: 10,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewVisibility: {
      type: String,
      enum: ["Active", "Pending", "Suspend", "Decline", "Inactive"],
      default: "Active",
    },
    createdDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reviews", reviewSchema);
