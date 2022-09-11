const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const cartItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    unitPrice: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      ////required: true,
    },
    paymentOption: {
      type: String,
      enum: ["Takeaway", "Online", "CashOnDelivery"],
      default: "Online",
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true },
  { new: true }
);

module.exports = mongoose.model("cartItem", cartItemSchema);
