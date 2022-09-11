const mongoose = require("mongoose");

const RatingShopSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    noOfRaters: {
      type: Number,
      //required: true,
    },
    createdDate: { type: Date },
  },
  {
    timestamps: true,
  }
);
/* 
What is the difference between methods and statics Mongoose?
Methods operate on an instance of a model. Statics behave as 
helper functions only and can perform any action you want, 
including collection level searching. They aren't tied to an 
instance of a Model. But methods are also defined on models and work on all the instances of that model. */

RatingShopSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        shopId: Id,
      },
    },
    {
      $group: {
        _id: model,
        average: {
          $avg: "$rating",
        },
      },
    },
  ]);
  const obj2 = await this.count({
    $match: {
      shopId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("Shop").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingShopSchema.post("save", function () {
  this.constructor.getAverageCost(this.shopId, "$shopId");
});
RatingShopSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.shopId, "$shopId");
});

module.exports = mongoose.model("ratingShop", RatingShopSchema);
