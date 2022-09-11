const mongoose = require("mongoose");

const RatingProjectSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
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

RatingProjectSchema.statics.getAverageCost = async function (Id, model) {
  console.log("Cal avg cost...");
  const obj1 = await this.aggregate([
    {
      $match: {
        projectId: Id,
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
      projectId: Id,
    },
  });

  console.log(obj1);
  console.log(obj2);

  try {
    await this.model("Project").findByIdAndUpdate(Id, {
      rating: obj1[0].average,
      noOfRaters: obj2,
    });
  } catch (err) {
    console.log(err);
  }
};
RatingProjectSchema.post("save", function () {
  this.constructor.getAverageCost(this.projectId, "$projectId");
});
RatingProjectSchema.pre("remove", function () {
  this.constructor.getAverageCost(this.projectId, "$projectId");
});
module.exports = mongoose.model("ratingProject", RatingProjectSchema);
