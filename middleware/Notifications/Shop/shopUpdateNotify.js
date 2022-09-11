const user = require("../../../models/user");
const notification = require("../../../models/Notifications/notifications");

exports.updateNotify = async (req, res, next) => {
  try {
    //#######################Send admin notification###########################
    //Create notificatioon
    const notifybody = {
      Title: "Shop updating Request",
      Description: `Shop ${req.shop.id} update requested from user ${req.user.id}`,
      createdBy: `${req.user.id}`,
      sendBy: `${req.user.id}`,
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

    const users = await user.find({ role: "Admin" });
    const admins = [];
    console.log(users);

    for (const admin of users) {
      // const { path } = admin;
      admins.push(admin.id);
    }
    console.log("################");
    console.log(admins);
    //Update all admins notifications
    await user.updateMany(
      { role: "Admin" },
      {
        $push: {
          notifications: Notification.id,
        },
      },
      { new: true }
    );

    //
    const updated = await notification.findByIdAndUpdate(
      not._id,
      {
        $push: {
          user: admins,
        },
      },
      { new: true }
    );
    next();
    res
      .status(200)
      .json({ success: true, data: req.shop, notification: notify });
    //#######################Send admin notification###########################
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
