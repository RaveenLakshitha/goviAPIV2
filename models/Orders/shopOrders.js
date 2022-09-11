const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const shopOrderSchema = mongoose.Schema(
  {
    refNo: {
      type: String,
    },
    slug: String,
    orderedItem: { type: mongoose.Schema.Types.ObjectId, ref: "cartItem" },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contactNumber: {
      type: String,
      //required: true,
      min: 9,
      trim: true,
    },
    additionalPhoneNumber: {
      type: String,
    },
    shippingaddress: {
      type: String,
      //required: [true, "Please add a Address"],
      min: 6,
      max: 10,
      select: false,
    },
    addressType: {
      type: String,
      //required: true,
      enum: ["Home", "Office"],
      default: "Home",
    },
    city: {
      type: String,
      //required: true,
      trim: true,
    },
    orderDate: {
      type: Date,
      //required: true,
    },
    deliveryDate: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: ["Comfirmed", "Declined", "Pending"],
      default: "Pending",
    },
    deliveryStatus: {
      type: Boolean,
      default: false,
    },
    userToAdminPay: {
      type: Boolean,
      default: false,
    },
    adminToShopPay: {
      type: Boolean,
      default: false,
    },
    paymentOption: {
      type: String,
      enum: ["Takeaway", "Online", "CashOnDelivery"],
      default: "Online",
    },
    totalPrice: {
      type: Number,
      default: 0,
      ////required: true,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("shopOrder", shopOrderSchema);
