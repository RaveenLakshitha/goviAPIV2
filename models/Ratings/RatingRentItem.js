const mongoose = require("mongoose");

const RatingRentItemSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rentItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RentItems",
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

RatingRentItemSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        rentItemId: Id,
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
      rentItemId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("RentItems").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingRentItemSchema.post("save", function () {
  this.constructor.getAverageCost(this.rentItemId, "$rentItemId");
});
RatingRentItemSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.rentItemId, "$rentItemId");
});
module.exports = mongoose.model("ratingRentItem", RatingRentItemSchema);
