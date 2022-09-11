const user = require("../../../models/user");
const notification = require("../../../models/Notifications/notifications");

exports.notify = async (req, res, next) => {
  try {
    //Create notificatioon######################################################
    const notifybody = {
      Title: "Advertisement Request",
      Description: `Advertisement ${req.add.id} requested from user ${req.user.id}`,
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
    //Create notificatioon######################################################
    next();
    res
      .status(201)
      .json({ success: true, data: req.add, notification: notify });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
