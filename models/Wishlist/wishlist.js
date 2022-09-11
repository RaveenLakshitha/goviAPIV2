const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const wishlistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wishListItem",
      },
    ],
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  { timestamps: true }
);
/* cartSchema.index({ expireAt: 1 }, { expireAfterSeconds: 5 }); */
module.exports = mongoose.model("wishList", wishlistSchema);
