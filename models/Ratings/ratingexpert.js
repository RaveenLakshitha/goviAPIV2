const mongoose = require("mongoose");

const RatingExpertSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
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

RatingExpertSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        expertId: Id,
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
      expertId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("Expert").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingExpertSchema.post("save", function () {
  this.constructor.getAverageCost(this.expertId, "$expertId");
});
RatingExpertSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.expertId, "$expertId");
});
module.exports = mongoose.model("ratingExpert", RatingExpertSchema);
