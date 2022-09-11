const Architect = require("../../models/Architects/architect");
const ErrorResponse = require("../../utils/errorResponse");
const ArchitectRecords = require("../../models/Statistics/ArchitectRecords");

//@desc     Get a architect
//@route    Get /api/v1/architects/:id
//@access   Public
exports.getUserRegistrationGraph = async (req, res, next) => {
  try {
    var apps = [];
    const architect = await Architect.findOne({
      user: req.user.id,
    });

    if (!architect) {
      return next(
        new ErrorResponse(`Architect not Found With id of ${req.user.id}`, 404)
      );
    }

    apps = architect.archiectRecords;

    const archi = await Architect.findOne({ user: req.user._id });

    var arr = await ArchitectRecords.aggregate([
      {
        $match: {
          architect: archi._id,
        },
      },

      {
        $group: {
          _id: {
            truncatedOrderDate: {
              $dateTrunc: {
                date: "$createdAt",
                unit: "week",
                binSize: 2,
              },
            },
            architect: archi._id,
          },
          NoOfAppontments: { $sum: "$numofAppointments" },
        },
      },
    ]);
    console.log(arr);

    /* 
     Get data of past 7 days
     var d = new Date();
      d.setDate(d.getDate() - 7);
  
      const data = await ArchitectRecords.find({ createdAt: { $gt: d } });
      console.log(data); */

    res.status(200).json({ success: true, data: arr });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
