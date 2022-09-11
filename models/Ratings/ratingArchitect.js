const mongoose = require("mongoose");

const RatingArchitectSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    architectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Architect",
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

RatingArchitectSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        architectId: Id,
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
      architectId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("Architect").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingArchitectSchema.post("save", function () {
  this.constructor.getAverageCost(this.architectId, "$architectId");
});
RatingArchitectSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.architectId, "$architectId");
});
module.exports = mongoose.model("ratingArchitect", RatingArchitectSchema);
