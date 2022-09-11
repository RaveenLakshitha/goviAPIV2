const notifications = require("../../models/Notifications/notifications");
const user = require("../../models/user");

//@desc     Get all notifications
//@route    Post /api/v1/notifications
//@access   Public

exports.getNotifications = async (req, res, next) => {
  try {
    const Notifications = await notifications
      .find()
      .populate("user", { username: 1, email: 1 });
    res.status(200).json({
      success: true,
      count: Notifications.length,
      data: Notifications,
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all notifications
//@route    Post /api/v1/notifications
//@access   Public

exports.getNotificationsSendByUser = async (req, res, next) => {
  try {
    const Notifications = await notifications
      .find({
        sendBy: req.user.id,
        status: "Sent",
      })
      .populate("user", { username: 1, email: 1 });
    res.status(200).json({
      success: true,
      count: Notifications.length,
      data: Notifications,
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get all notifications
//@route    Post /api/v1/notifications
//@access   Public

exports.getNotificationsCreatedByUser = async (req, res, next) => {
  try {
    const Notifications = await notifications
      .find({ createdBy: req.user.id })
      .populate("user", { username: 1, email: 1 });
    res.status(200).json({
      success: true,
      count: Notifications.length,
      data: Notifications,
    });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get single notification
//@route    Post /api/v1/notifications/getSingleNotification/:id
//@access   Public

exports.getSingleNotification = async (req, res, next) => {
  try {
    const Notifications = await notifications.findById({
      _id: req.params.id,
      status: "Sent",
    });
    res.status(200).json({ success: true, data: Notifications });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Get users notifications
//@route    Post /api/v1/notifications/getSingleNotification/:id
//@access   Public

exports.getUsersNotifications = async (req, res, next) => {
  try {
    const Notifications = await notifications.find({
      user: req.user.id,
      status: "Sent",
    });
    res.status(200).json({ success: true, data: Notifications });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Create a notification
//@route    Post /api/v1/notifications
//@access   Public

exports.createNotification = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const Notification = await notifications.create(req.body);
    res.status(201).json({ success: true, data: Notification });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Send a notification to single user
//@route    Put /api/v1/notifications/sendToOne/:id
//@access   Public

exports.sendNotificationSingle = async (req, res, next) => {
  try {
    const alreadyN = await notifications.findById(req.body.notificationId);
    //const Notification = await notifications.findOOne(req.params.id);

    if (alreadyN) {
      const Notification = await notifications.findByIdAndUpdate(
        { _id: req.body.notificationId },
        {
          $set: { status: "Sent", sendBy: req.user.id },
        },
        { new: true }
      );

      await user.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            notifications: Notification.id,
          },
        },
        { new: true }
      ); // Notification.status = "Sent";
      // await Notification.save();
      const updated = await notifications.findOneAndUpdate(
        { _id: req.body.notificationId },
        {
          $push: {
            user: req.params.id,
          },
        },
        { new: true }
      );
      res.status(201).json({ success: true, data: updated });
    } else {
      return next(
        new ErrorResponse(
          `The notification with ID ${req.body.notificationId} has already sent to user ${req.params.id} `,
          400
        )
      );
    }
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Send a notification to single user
//@route    Put /api/v1/notifications/sendToOne/:id
//@access   Public

exports.removeNotificationSingle = async (req, res, next) => {
  try {
    //const Notification = await notifications.findOOne(req.params.id);
    const Notification = await notifications.findByIdAndUpdate(
      { _id: req.body.notificationId },
      {
        status: "Disabaled",
      },
      { new: true }
    );

    await user.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          notifications: req.body.notificationId,
        },
      },
      { new: true }
    );
    const updated = await notifications.findOneAndUpdate(
      { _id: req.body.notificationId },
      {
        $pull: {
          user: req.params.id,
        },
      },
      { new: true }
    );
    // Notification.status = "Sent";
    // await Notification.save();

    res.status(201).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Send a notification to all users
//@route    Post /api/v1/notifications/sendAll
//@access   Public

exports.sendNotificationAll = async (req, res, next) => {
  try {
    const Notification = await notifications.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: { status: "Sent", sendBy: req.user.id },
      },
      { new: true }
    );
    //check users arrays
    await user.updateMany(
      { notifications: { $nin: [req.params.id] } },
      {
        $push: {
          notifications: req.params.id,
        },
      },
      { new: true }
    );

    var arr = [];

    await user.find().then((memes) => {
      memes.forEach((meme) => {
        arr.push(meme._id);
      });
    });

    const updated = await notifications.updateOne(
      { _id: req.params.id },
      {
        $addToSet: {
          user: { $each: arr },
        },
      },
      { new: true }
    );

    res.status(201).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};

//@desc     Send a notification to all users
//@route    Post /api/v1/notifications/sendAll
//@access   Public

exports.removeNotificationAll = async (req, res, next) => {
  try {
    const Notification = await notifications.findByIdAndUpdate(
      { _id: req.params.id },
      {
        status: "Disabaled",
      },
      { new: true }
    );

    //check users arrays
    await user.updateMany(
      { notifications: { $in: [req.params.id] } },
      {
        $pull: {
          notifications: req.params.id,
        },
      },
      { new: true }
    );

    const updated = await notifications.updateOne(
      { _id: req.params.id },
      { $set: { user: [] } },
      { new: true }
    );

    res.status(201).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
//@desc     Delete a user
//@route    Delete /api/v1/advertisements/:id
//@access   Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const Notification = await notifications.findByIdAndDelete(req.params.id);

    if (!Notification) {
      return res.status(400).json({ success: false });
    }

    //check users arrays
    await user.updateMany(
      { notifications: { $in: [req.params.id] } },
      {
        $pull: {
          notifications: req.params.id,
        },
      },
      { new: true }
    );

    const updated = await notifications.updateOne(
      { _id: req.params.id },
      { $set: { user: [] } },
      { new: true }
    );

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ data: err });
    next(err);
  }
};
