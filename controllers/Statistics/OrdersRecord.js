const Order = require("../../models/Orders/shopOrders");
const ErrorResponse = require("../../utils/errorResponse");
const orderRecords = require("../../models/Statistics/Shops/orders");

//@desc     Get a architect
//@route    Get /api/v1/architects/:id
//@access   Public
exports.getOrdersGraphs = async (req, res, next) => {
  try {
    var apps = [];
    const order = await Order.findOne({
      user: req.user.id,
    });

    if (!order) {
      return next(
        new ErrorResponse(`Architect not Found With id of ${req.user.id}`, 404)
      );
    }

    apps = order.archiectRecords;

    const archi = await Order.findOne({ user: req.user._id });

    var arr = await orderRecords.aggregate([
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
  
      const data = await orderRecords.find({ createdAt: { $gt: d } });
      console.log(data); */

    res.status(200).json({ success: true, data: arr });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
