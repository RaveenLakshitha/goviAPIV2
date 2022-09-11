const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const ShopRecords = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  numofOrders: {
    type: Number,
    default: 1,
  },
  createdDate: { type: Date, default: dslr },
  updatedDate: { type: Date, default: dslr },
});

module.exports = mongoose.model("ShopRecords", ShopRecords);
