const mongoose = require("mongoose");
const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);
const geocoder = require("../../utils/geocoder");
jwt = require("jsonwebtoken");

const architectSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      min: 3,
      max: 20,
      //required: true,
      trim: true,
    },
    architectName: {
      type: String,
      min: 3,
      max: 20,
      //required: true,
      trim: true,
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
    description: {
      type: String,
      trim: true,
    },
    slug: String,
    contactNumber: {
      type: String,
      //required: true,
      minlength: 9,
      trim: true,
    },
    availableDateAndTime: {
      type: Date,
    },
    motto: {
      type: String,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    archiectReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    archiectRecords: [
      {
        type: mongoose.Schema.Types.Mixed,
        //ref: "ArchitectRecords",
      },
    ],
    services: [
      {
        type: String,
      },
    ],
    profilePicture: [
      {
        img: { type: String },
      },
    ],
    shopImages: [
      {
        img: { type: String },
      },
    ],
    proofDocuments: [
      {
        img: { type: String },
      },
    ],
    architectRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingArchitect",
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
    awards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Awards",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    projectCount: { type: Number },
    awardsCount: { type: Number },
    architectVisibility: {
      /* type: Boolean,
      default: false, */
      type: String,
      enum: ["Active", "Pending", "Suspend", "Decline", "Inactive"],
      default: "Pending",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    appointmentSlots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "architectAppointemtSlots",
      },
    ],
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
    coverImage: { type: String },
    createdDate: { type: Date },
  },
  {
    toObject: { virtuals: true },
    toJson: { virtuals: true },
  }
);
//Reverse populate
architectSchema.virtual("items", {
  ref: "Item",
  localField: "_id",
  foreignField: "shopId",
});

/* //Sign JWT and Return
architectSchema.methods.getShopSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

architectSchema.pre("save", async function (next) {
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

module.exports = mongoose.model("Architect", architectSchema);
