const user = require("../../../models/user");
const notification = require("../../../models/Notifications/notifications");
const Shop = require("../../../models/shop");
exports.visibilityChangedNotify = async (req, res, next) => {
  try {
    //#######################Send admin notification###########################
    //Create notificatioon
    const notifybody = {
      Title: "Shop Confirmation",
      createdBy: `${req.user.id}`,
      sendBy: `${req.user.id}`,
      Description: `Shop ${req.shop} is now visible`,
      DateAndTime: Date.now(),
    };
    const not = await notification.create(notifybody);
    var notify = "Send";
    //Set status as sent in notifications
    const Notification = await notification.findByIdAndUpdate(
      { _id: not._id },
      {
        status: "Sent",
      },
      { new: true }
    );

    const userShop = await Shop.findById(req.shop);

    //Update all admins notifications
    await user.findByIdAndUpdate(
      userShop.user,
      {
        $push: {
          notifications: Notification.id,
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, data: req.shop, notification: notify });

    //#######################Send admin notification###########################
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
