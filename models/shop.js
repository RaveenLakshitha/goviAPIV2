const mongoose = require("mongoose");
const geocoder = require("../utils/geocoder");
jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      min: 3,
      max: 20,
      //required: true,
      trim: true,
    },
    profilePic: [
      {
        img: { type: String },
      },
    ],
    publicId: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    publicIds: [
      {
        type: String,
      },
    ],
    shopCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
      },
    ],
    slug: String,
    contactNumber: {
      type: String,
      //required: true,
      minlength: 9,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      //required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
    },
    delivery: {
      type: String,
      enum: ["Available", "Not Available"],
      default: "Available",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    googlelocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },

      formattedAddress: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipcode: { type: String },
      countryCode: { type: String },
    },
    city: { type: String },
    NIC: {
      type: String,
      match: [
        /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/,
        "Please add a valid NIC Number",
      ],
    },
    shopPictures: [
      {
        img: { type: String },
      },
    ],
    proofDocs: [
      {
        img: { type: String },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shopReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    shopRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingShop",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      //required: true,
    },

    raters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shopItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    ordersId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shopOrder",
      },
    ],
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
    itemCount: { type: Number },
    shopVisibility: {
      type: String,
      enum: ["Active", "Pending", "Suspend", "Decline", "Inactive"],
      default: "Pending",
    },

    createdDate: { type: Date /* default: Date.now  */ },
    logo: { type: String },
    coverImage: { type: String },
    createdDate: { type: Date },
  },
  {
    timestamps: true,
  },
  {
    toObject: { virtuals: true },
    toJson: { virtuals: true },
  }
);
//Reverse populate
shopSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "shopId",
});

//Sign JWT and Return
shopSchema.methods.getShopSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

/* shopSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  console.log(loc);
  this.googlelocation = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].street,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    countryCode: loc[0].countryCode,
  };

  next();
}); */

module.exports = mongoose.model("Shop", shopSchema);
