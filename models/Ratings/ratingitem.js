const mongoose = require("mongoose");

const RatingItemSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
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

RatingItemSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        itemId: Id,
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
      itemId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("Item").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingItemSchema.post("save", function () {
  this.constructor.getAverageCost(this.itemId, "$itemId");
});
RatingItemSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.itemId, "$itemId");
});

module.exports = mongoose.model("ratingItem", RatingItemSchema);
