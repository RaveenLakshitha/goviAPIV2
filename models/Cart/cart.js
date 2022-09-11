const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cartItem",
      },
    ],
    cartTotalPrice: {
      type: Number,
      ////required: true,
      default: 0,
    },
    priceToPayOnline: {
      type: Number,
      default: 0,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
/* const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cartItem",
      },
    ],
    cartTotalPrice: {
      type: Number,
      ////required: true,
      default: 0,
    },
    priceToPayOnline: {
      type: Number,
      default: 0,
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
 */
