const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const userOrderSchema = mongoose.Schema(
  {
    refNo: {
      type: String,
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    qty: {
      type: Number,
      //required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      //required: true,
    },
    totalOnlinePrice: {
      type: Number,
      //required: true,
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
    address: {
      type: String,
      //required: [true, "Please add a Address"],
      min: 6,
      max: 10,
      select: false,
    },
    orderDate: {
      type: Date,
      //required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Comfirmed", "Declined", "Pending"],
      default: "Pending",
    },
    userToAdminPay: {
      type: Boolean,
      default: false,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userOrder", userOrderSchema);
