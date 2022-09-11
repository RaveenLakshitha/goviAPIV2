const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
jwt = require("jsonwebtoken");
const slugify = require("slugify");

const moment = require("moment-timezone");
const dateSRL = moment.tz(Date.now(), "Asia/Colombo");
const dslr = new Date(`${dateSRL.utc().format()}`);

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      min: 3,
      max: 20,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      // required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      //required: [true, "Please add a Password"],
      min: 6,
      select: false,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      //required: true,
      trim: true,
    },
    district: {
      type: String,
      //required: true,
      trim: true,
    },
    designation: {
      type: String,
      //required: true,
    },
    contactNumber: {
      type: String,
      //required: true,
      minlength: 9,
      trim: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wishList",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userOrder",
      },
    ],
    adminOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shopOrder",
      },
    ],
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
    },
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "../Architects/architect",
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Expert"],
      default: "User",
    },
    questAsked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Questions",
      },
    ],
    questAnswerd: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answers",
      },
    ],
    addedReviewsShop: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    addedReviewsItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    addedReviewsExperts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    expertRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingExpert",
      },
    ],
    shopRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingShop",
      },
    ],
    itemRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingItem",
      },
    ],
    projectRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingProject",
      },
    ],
    rentItemRatings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingRentItem",
      },
    ],
    ratingSum: {
      type: Number,
      //required: true,
    },
    raters: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
      },
    ],
    createdAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "appointment",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notification",
      },
    ],
    ratingAvg: {
      type: Number,
      //required: true,
    },
    userVisibility: {
      type: String,
      enum: ["Active", "Suspend", "Inactive"],
      default: "Active",
    },
    location: {
      type: String,
    },
    resetPasswordToken: { type: String },
    restPasswordExpire: { type: Date },
    profilePicture: { type: String },
    createdDate: { type: Date, default: dslr },
    updatedDate: { type: Date, default: dslr },
  },
  {
    toObject: { virtuals: true },
    toJson: { virtuals: true },
  }
);
/* // Create users slugify from name
userSchema.pre("save", function (next) {
  this.slug = slugify(this.email, { lower: true });
  next();
}); */

//Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and Return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set expire
  this.restPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//Match user entered password and hash+password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Reverse populate
userSchema.virtual("shop", {
  ref: "Shop",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

module.exports = mongoose.model("User", userSchema);
/*
,*/
